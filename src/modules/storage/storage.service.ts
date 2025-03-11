import { format, parse } from 'node:path';
import { Readable } from 'node:stream';

import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';

import { S3_CLIENT_PROVIDER_TOKEN } from './constants/s3-client-provider-token.const';
import { DeletionFailedException } from './exceptions/deletion-failed.exception';
import { UploadFailedException } from './exceptions/upload-failed.exception';
import { STORAGE_MODULE_OPTIONS_TOKEN } from './storage.module-definition';
import { StorageModuleConfig } from './types/storage-module-config.type';

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_MODULE_OPTIONS_TOKEN)
    private readonly options: StorageModuleConfig,
    @Inject(S3_CLIENT_PROVIDER_TOKEN) private readonly s3: S3Client,
  ) {}

  async upload(parameters: {
    file: string | Uint8Array | Buffer | Readable;
    filePath: string;
    preserveFileName?: boolean;
  }): Promise<string> {
    const { filePath, file: buffer, preserveFileName = false } = parameters;

    try {
      let fileKey: string = filePath;

      if (!preserveFileName) {
        const timestamp = Date.now();
        const parsedFilePath = parse(filePath);
        const { name: fileName } = parsedFilePath;

        fileKey = format({
          ...parsedFilePath,
          base: undefined,
          name: `${timestamp}-${fileName}`,
        });
      }

      const command = new PutObjectCommand({
        Bucket: this.options.bucket,
        Key: fileKey,
        Body: buffer,
      });

      await this.s3.send(command);

      return fileKey;
    } catch (error) {
      throw new UploadFailedException(filePath, { cause: error });
    }
  }

  async delete(fileKey: string | string[]): Promise<void> {
    const fileKeys = Array.isArray(fileKey) ? fileKey : [fileKey];

    try {
      const command = new DeleteObjectsCommand({
        Bucket: this.options.bucket,
        Delete: { Objects: fileKeys.map((Key) => ({ Key })) },
      });

      await this.s3.send(command);
    } catch (error) {
      throw new DeletionFailedException(fileKeys, { cause: error });
    }
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    const command = new ListObjectsCommand({
      Bucket: this.options.bucket,
      Prefix: prefix,
    });

    const { Contents: files } = await this.s3.send(command);

    const fileKeys = files
      ?.map((f) => f.Key)
      .filter((f): f is string => typeof f === 'string');

    if (fileKeys) await this.delete(fileKeys);
  }

  async getSignedUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.options.bucket,
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(this.s3, command);

    return signedUrl;
  }
}
