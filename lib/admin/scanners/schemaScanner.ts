import { PostRecord } from '../repositories/post.repository';

export class SchemaScanner {
  /**
   * Checks for valid JSON-LD schema scripts inside article HTML content.
   */
  static audit(posts: PostRecord[]): { missingSchemaCount: number } {
    let missingSchema = 0;

    posts.forEach(p => {
      const content = p.content || '';
      const hasLdJson = content.includes('application/ld+json') || content.includes('@context');
      if (!hasLdJson) {
        missingSchema++;
      }
    });

    return {
      missingSchemaCount: missingSchema,
    };
  }
}
