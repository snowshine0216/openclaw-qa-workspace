const { parseMarkdownLink, parseInlineContent } = require('../../reporting/docx_converter');

describe('DOCX Converter', () => {
  describe('parseMarkdownLink', () => {
    it('should extract text and url from a markdown link', () => {
      const parsed = parseMarkdownLink('[My Link](http://example.com)');
      expect(parsed).toEqual({
        text: 'My Link',
        url: 'http://example.com',
        isLink: true
      });
    });

    it('should return plain text if no markdown link is present', () => {
      const parsed = parseMarkdownLink('Just some plain text');
      expect(parsed).toEqual({
        text: 'Just some plain text',
        url: null,
        isLink: false
      });
    });

    it('should handle broken links properly', () => {
      const parsed = parseMarkdownLink('Broken [Link] (url)');
      expect(parsed).toEqual({
        text: 'Broken [Link] (url)',
        url: null,
        isLink: false
      });
    });
  });

  describe('parseInlineContent', () => {
    // Only basic unit testing because TextRun/ExternalHyperlink are objects from the docx module
    it('should split text with bold and links into docx components', () => {
      const content = 'See [this link](http://foo.bar) for more **details** today.';
      const elements = parseInlineContent(content);
      
      // elements should contain: 
      // 1. TextRun for "See "
      // 2. ExternalHyperlink for "[this link](http://foo.bar)"
      // 3. TextRun for " for more "
      // 4. TextRun (bold) for "**details**"
      // 5. TextRun for " today."
      
      expect(elements).toHaveLength(5);
      
      expect(elements).toHaveLength(5);
    });
  });
});
