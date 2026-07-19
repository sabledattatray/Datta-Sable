import { PostRecord } from '../repositories/post.repository';

export class MetadataScanner {
  /**
   * Scans posts for missing metadata (excerpt, canonical, image).
   */
  static audit(posts: PostRecord[]): { missingMetaCount: number; missingImagesCount: number } {
    let missingMeta = 0;
    let missingImages = 0;

    posts.forEach(p => {
      if (!p.excerpt || p.excerpt.trim() === '') {
        missingMeta++;
      }
      if (!p.image || p.image.trim() === '') {
        missingImages++;
      }
    });

    return {
      missingMetaCount: missingMeta,
      missingImagesCount: missingImages,
    };
  }
}
