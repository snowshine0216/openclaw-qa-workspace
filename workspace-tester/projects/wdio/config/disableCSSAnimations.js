module.exports = function () {
    const css =
            '* {' +
            '-webkit-transition-duration: 0s !important;' +
            'transition-duration: 0s !important;' +
            '-webkit-animation-duration: 0s !important;' +
            'animation-duration: 0s !important;' +
            '}',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);

    // // Disable jquery animations
    // const disableAniamtionScriptElem = document.createElement('script');
    // const disableAniamtionScript = document.createTextNode('$.fx.off = true;');
    // disableAniamtionScriptElem.appendChild(disableAniamtionScript);
    // head.appendChild(disableAniamtionScriptElem);
};
