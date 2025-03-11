import { Expose } from 'class-transformer';

import { PageOptionsMetadataResponseBodyDto } from './page-options-metadata-response-body.dto';

export class PageOptionsResponseBodyDto {
  constructor(data: {
    metadata: ConstructorParameters<
      typeof PageOptionsMetadataResponseBodyDto
    >[0];
  }) {
    Object.assign(this, data);
    this.metadata = new PageOptionsMetadataResponseBodyDto(data.metadata);
  }

  @Expose()
  metadata: PageOptionsMetadataResponseBodyDto;
}
