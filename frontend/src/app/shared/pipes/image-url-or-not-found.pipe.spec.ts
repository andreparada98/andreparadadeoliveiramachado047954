import { ImageUrlOrNotFoundPipe } from './image-url-or-not-found.pipe';

describe('ImageUrlOrNotFoundPipe', () => {
  const pipe = new ImageUrlOrNotFoundPipe();

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the same url if provided', () => {
    const url = 'http://example.com/image.jpg';
    expect(pipe.transform(url)).toBe(url);
  });

  it('should return default image if url is empty or undefined', () => {
    const defaultImage = 'assets/images/image-not-found.png';
    expect(pipe.transform('')).toBe(defaultImage);
    expect(pipe.transform(undefined)).toBe(defaultImage);
  });
});

