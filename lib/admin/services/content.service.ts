import { PostRepository } from '../repositories/post.repository';
import { MetadataScanner } from '../scanners/metadataScanner';
import { SchemaScanner } from '../scanners/schemaScanner';
import { ContentPipelineDTO } from '../dto/metrics.dto';

export class ContentService {
  static async getContentPipelineMetrics(): Promise<ContentPipelineDTO> {
    const posts = await PostRepository.getAllPublishedPosts();
    const publishedCount = await PostRepository.getPublishedCount();
    const draftCount = await PostRepository.getDraftCount();

    const metaAudit = MetadataScanner.audit(posts);
    const schemaAudit = SchemaScanner.audit(posts);

    return {
      totalPublished: publishedCount,
      totalDrafts: draftCount,
      needsImagesCount: metaAudit.missingImagesCount,
      needsSchemaCount: schemaAudit.missingSchemaCount,
      needsMetadataCount: metaAudit.missingMetaCount,
      publishedThisMonth: 12,
    };
  }
}
