export function getElementXpath() {
    const eleme = arguments[0];

    function getXPath(node) {
        let comp,
            comps = [];
        let parent = null;
        let xpath = '';
        let getPos = function (node) {
            let position = 1,
                curNode;
            if (node.nodeType == Node.ATTRIBUTE_NODE) {
                return null;
            }
            for (curNode = node.previousSibling; curNode; curNode = curNode.previousSibling) {
                if (curNode.nodeName == node.nodeName) {
                    ++position;
                }
            }
            return position;
        };

        if (node instanceof Document) {
            return '/';
        }

        for (
            ;
            node && !(node instanceof Document);
            node = node.nodeType == Node.ATTRIBUTE_NODE ? node.ownerElement : node.parentNode
        ) {
            comp = comps[comps.length] = {};
            switch (node.nodeType) {
                case Node.TEXT_NODE:
                    comp.name = 'text()';
                    break;
                case Node.ATTRIBUTE_NODE:
                    comp.name = '@' + node.nodeName;
                    break;
                case Node.PROCESSING_INSTRUCTION_NODE:
                    comp.name = 'processing-instruction()';
                    break;
                case Node.COMMENT_NODE:
                    comp.name = 'comment()';
                    break;
                case Node.ELEMENT_NODE:
                    comp.name = node.nodeName;
                    break;
            }
            comp.position = getPos(node);
        }

        for (let i = comps.length - 1; i >= 0; i--) {
            comp = comps[i];
            xpath += '/' + comp.name;
            if (comp.position != null) {
                xpath += '[' + comp.position + ']';
            }
        }

        return xpath;
    }
    return getXPath(eleme);
}
