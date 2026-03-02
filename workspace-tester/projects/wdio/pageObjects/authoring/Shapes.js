import { Key } from 'webdriverio';
import BasePage from '../base/BasePage.js';
import BaseContainer from './BaseContainer.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import Common from './Common.js';
import BaseFormatPanel from './BaseFormatPanel.js'

/** 
 * Page representing the Shape
 * @extends BasePage
 */

export default class Shapes extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
        this.baseContainer = new BaseContainer();
        this.baseFormatPanel = new BaseFormatPanel();
    }

    // use to validate the format of shapes
    get ShapeFormatSection(){
        return this.$(`(//div[@id='reactFormatPanel']//li[@class='vertical-list-items'])[1]`);
    }
    
    getSvgClass(ContainerName) {
        return baseContainer.getContainer(ContainerName).$(`./descendant::div[@class='mstrmojo-DocShape ']//*[name()='svg']`)
    }

    getShapeTagUnderSvgClass() {
        return this.getSvgClass().$(`.//*[name()='defs']/following-sibling::*`)
    }

    // can also be used for line shape style
    get shapeBorderStylePulldown() {
        return this.$(`(//div[contains(@class, 'ant-select-show-arrow')])[1]`);
    }

    getshapeOuterBorderOption(style) {
        return this.$(`//div[contains(@class, 'ant-select-dropdown')]//div[contains(@class, 'ant-select-item')]//span[contains(@class, '${style}')]`);
    }

    get shapeBorderColorPulldown() {
        return this.$(`(//li[@class='horizontal-list-items']//div[@class='mstr-color-picker-dropdown'])[2]`);
    }

    get shapeFillColorButton() {
        return this.$(`(//li[@class='horizontal-list-items']//div[@class='mstr-color-picker-dropdown'])[1]`);
    }

    get lineStartArrowPulldown(){
        return this.$(`//div[contains(@class, 'ant-select-show-arrow') and @aria-label = 'Start']`);
    }

    get lineEndArrowPulldown(){
        return this.$(`//div[contains(@class, 'ant-select-show-arrow') and @aria-label = 'End']`);
    }

    getLineArrowSelectOption(startArrow) {
        return this.$(`//div[contains(@class,'dropdown') and not(contains(@class, 'ant-select-dropdown-hidden'))]//div[contains(@class,'list')]//div[contains(@class,'option-content')]//span[contains(@class, '${startArrow}')]`);
    }

    get lineStartArrow(){
        return this.getSvgClass().$(`(.//*[name()='defs']//*[name()='marker']//*[name()='path'])[1]`);
    }

    get lineEndArrow(){
        return this.getSvgClass().$(`(.//*[name()='defs']//*[name()='marker']//*[name()='path'])[2]`);
    }

    // can also be used for line shape width
    get ShapeOuterBorderWidthInput() {
        return this.$(`(//div[contains(@class, 'two-to-one-layout')]//div[@class='ant-input-number-input-wrap']//input)[1]`);
    }
    
    get ShapeOuterBorderIncreaseBtn() {
        return this.$(`(//div[contains(@class, 'two-to-one-layout')]//div[@class='ant-input-number-handler-wrap']//span[@aria-label='Increase Value'])[1]`);
    }

    get ShapeOuterBorderDecreaseBtn() {
        return this.$(`(//div[contains(@class, 'two-to-one-layout')]//div[@class='ant-input-number-handler-wrap']//span[@aria-label='Decrease Value'])[1]`);
    }

    get ShapeFillColorOpacityInput() {
        return this.$(`//div[contains(@class, 'container-fill-opacity-layout')]//div[@class='ant-input-number-input-wrap']//input`);
    }

    // for rectangle radius and triangle direction
    getRadioButton(option){
        return this.$(`//div[contains(@class, 'ant-radio-group-outline')]//div[contains(@aria-label, '${option}')]`);
    }

    getLineDirectionButton(option){
        return this.$(`//div[contains(@class, 'ant-radio-group-outline')]//div[contains(@id, '${option}')]`);
    }

    getRadioButtonLabel(option){
        return this.getRadioButton.$(`//div[contains(@class, 'ant-radio-group-outline')]//div[contains(@aria-label, '${option}')]//label`);
    }

    get polygonSidesInput(){
        return this.$(`(//div[contains(@class, 'two-to-one-layout')]//div[@class='ant-input-number-input-wrap']//input)[2]`);
    }

    get polyonSidesIncreaseBtn() {
        return this.$(`(//div[contains(@class, 'two-to-one-layout')]//div[@class='ant-input-number-handler-wrap']//span[@aria-label='Increase Value'])[2]`);
    }

    get polyonSidesDecreaseBtn() {
        return this.$(`(//div[contains(@class, 'two-to-one-layout')]//div[@class='ant-input-number-handler-wrap']//span[@aria-label='Decrease Value'])[2]`);
    }

    async changeShapeBorderStyle(style) {
        let el = await this.shapeBorderStylePulldown;
        await browser.waitUntil(EC.visibilityOf(el));
        await this.clickOnElement(el);
        await this.selectShapeBorderStyleFromDropdown(style);
    }

    async selectShapeBorderStyleFromDropdown(style) {
        let elBorderOption = await this.getshapeOuterBorderOption(style);
        await browser.waitUntil(EC.presenceOf(elBorderOption));
        await this.clickOnElement(elBorderOption);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectShapeBorderColorButton() {
        let el = await this.shapeBorderColorPulldown;
        //await browser.waitUntil(EC.visibilityOf(el));
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async selectShapeFillColorButton() {
        let el = await this.shapeFillColorButton;
        await browser.waitUntil(EC.visibilityOf(el));
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async selectLineShapeColorButton() {
        let el = await this.shapeFillColorButton;
        await browser.waitUntil(EC.visibilityOf(el));
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(3);
    }

    async verifyOuterBorderWidth(expectWidth) {
        await this.sleep(1)
        let el = await this.getShapeTagUnderSvgClass();
        let widthCss = await el.getCSSProperty('stroke-width');
        let w = widthCss.value.slice(0, -2);
        await expect(w).to.equal(expectWidth);
    }

    async selectLineStartArrow(arrowOption) {
        let el = await this.lineStartArrowPulldown;
        await browser.waitUntil(EC.visibilityOf(el));
        await this.clickOnElement(el);

        // Make sure the pulldown is open before continuing
        let elMenuOption = await this.getLineArrowSelectOption(arrowOption);
        await browser.waitUntil(EC.presenceOf(elMenuOption));
        await this.clickOnElement(elMenuOption);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectLineEndArrow(arrowOption) {
        let el = await this.lineEndArrowPulldown;
        await browser.waitUntil(EC.visibilityOf(el));
        await this.clickOnElement(el);

        // Make sure the pulldown is open before continuing
        let elMenuOption = await this.getLineArrowSelectOption(arrowOption);
        await browser.waitUntil(EC.presenceOf(elMenuOption));
        await this.clickOnElement(elMenuOption);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async verifyLineStartArrow(startArrow) {
        let el = await this.lineStartArrow;
        let path = await el.getAttribute('d').then(async function(text){
            return text;});
        switch (startArrow) {
            case "dash":
                await expect(path).to.equal('');
                break;
            case "arrow-line":
                await expect(path == 'M0 3.5 L10 7 L0 3.5 L10 0 Z').to.equal(true);
                break;
            case "vector":
                await expect(path == 'M0 3.5 L10 7 L10 0 Z').to.equal(true);
                break;
        }
    }

    async verifyLineEndArrow(endArrow) {
        let el = await this.lineEndArrow;
        let path = await el.getAttribute('d').then(async function(text){
            return text;});
        switch (endArrow) {
            case "dash":
                await expect(path).to.equal('');
                break;
            case "arrow-line":
                await expect(path == 'M10 3.5 L0 7 L10 3.5 L0 0 Z').to.equal(true);
                break;
            case "vector":
                await expect(path == 'M10 3.5 L0 7 L0 0 Z').to.equal(true);
                break;
        }
    }

    async verifyLineDirection(expectedDirection){
        let el = await this.getShapeTagUnderSvgClass();
        // Retrieve line attributes
        let x1 = parseFloat(await el.getAttribute('x1'));
        let x2 = parseFloat(await el.getAttribute('x2'));
        let y1 = parseFloat(await el.getAttribute('y1'));
        let y2 = parseFloat(await el.getAttribute('y2'));

        // Retrieve SVG dimensions (height and width)
        let svgEl = await this.getSvgClass();
        let height = parseFloat(await svgEl.getAttribute('height'));
        let width = parseFloat(await svgEl.getAttribute('width'));

        switch (expectedDirection) {
            case "option-0":
                await expect(y1).to.equal(y2);
                break;

            case "option-1":
                await expect(x1).to.equal(x2);
                break;

            case "option-2":
                await expect(x1 === 0 && y1 === 0 && y2 === height && x2 === width).to.equal(true);
                break;

            case "option-3": 
                await expect(x1 === 0 && y2 === 0 && y1 === height && x2 === width).to.equal(true);
                break;

            default:
                throw new Error(`Invalid expectedDirection: "${expectedDirection}"`);
        }
    }

    async ChangeShapeOuterBorderWidth(Width) {
        let WidthInputEl = await this.ShapeOuterBorderWidthInput;
        await baseFormatPanel.clearAndSetValue(WidthInputEl, Width)
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async ClickBorderWidthIncreaseBtnForTimes(times) {
        let increaseBtn = await this.ShapeOuterBorderIncreaseBtn;
        for (var i = 0; i < times; i++) {
            await this.clickOnElement(increaseBtn);
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
    
    async ClickBorderWidthDecreaseBtnForTimes(times) {
        let decreaseBtn = await this.ShapeOuterBorderDecreaseBtn;
        for (var i = 0; i < times; i++) {
            await this.clickOnElement(decreaseBtn);
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async ChangeShapeFillColorOpacity(opacity) {
        await this.sleep(1)
        let opacityInputEl = await this.ShapeFillColorOpacityInput;
        await this.moveAndClickByOffsetFromElement(opacityInputEl, -2, 0)
      
        await browser.keys([Key.Ctrl, 'a'])
        await browser.keys([Key.Backspace]);
        await opacityInputEl.addValue(opacity);
        await browser.keys([Key.Enter]);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // Line direction, rectangle radius and triangle direction
    async ClickOnRadioButton(option) {
        let radiusBtn = await this.getRadioButton(option);
        await this.clickOnElement(radiusBtn);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async ClickOnLineDirectionButton(option) {
        let LineDir = await this.getLineDirectionButton(option);
        await this.clickOnElement(LineDir);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async verifyCircle() {
        let el = this.getShapeTagUnderSvgClass();
        let rx = await el.getCSSProperty('rx');
        let ry = await el.getCSSProperty('ry');
        await expect(rx.value === ry.value).to.equal(true);
    }

    async verifyEllipse() {
        let el = this.getShapeTagUnderSvgClass();
        let rx = await el.getCSSProperty('rx');
        let ry = await el.getCSSProperty('ry');
        await expect(rx.value !== ry.value).to.equal(true);
    }

    async selectPolygonSlides(sides) {
        let sidesInputEl = await this.polygonSidesInput;
        await baseFormatPanel.clearAndSetValue(sidesInputEl, sides)
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async ClickPolygonSlidesIncreaseBtnForTimes(times) {
        let increaseBtn = await this.polyonSidesIncreaseBtn;
        for (var i = 0; i < times; i++) {
            await this.clickOnElement(increaseBtn);
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
    
    async ClickPolygonSlidesDecreaseBtnForTimes(times) {
        let decreaseBtn = await this.polyonSidesDecreaseBtn;
        for (var i = 0; i < times; i++) {
            await this.clickOnElement(decreaseBtn);
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async verifyPolygonSlides(slides){
        await this.sleep(1)
        let el = await this.getShapeTagUnderSvgClass();
        let pointsEl = await el.getAttribute('points').then(async function(text){
            return text;
        });
        let numberOfValues = await pointsEl.split(",").length
        switch (slides) {
            case "3":
                await expect(numberOfValues==4).to.equal(true);
                break;
            case "4":
                await expect(numberOfValues==5).to.equal(true);
                break;
            case "5":
                await expect(numberOfValues==6).to.equal(true);
                break;
            case "6":
                await expect(numberOfValues==7).to.equal(true);
                break;
            case "7":
                await expect(numberOfValues==8).to.equal(true);
                break;
            case "8":
                await expect(numberOfValues==9).to.equal(true);
                break;
            case "9":
                await expect(numberOfValues==10).to.equal(true);
                break;
            case "10":
                await expect(numberOfValues==11).to.equal(true);
                break;
        }
    }

    async verifyTriangleDirection(direction){
        // Get the triangle's `points` attribute
        let el = await this.getShapeTagUnderSvgClass();
        let pointsEl = await el.getAttribute('points');

        if (!pointsEl) {
            throw new Error('Triangle points attribute is missing or invalid.');
        }

        // Parse the points
        let [v1, v2, v3] = pointsEl.split(" ");
        let [x1, y1] = v1.split(",").map(Number);
        let [x2, y2] = v2.split(",").map(Number);
        let [x3, y3] = v3.split(",").map(Number);

        // Get SVG height and width
        let svgEl = await this.getSvgClass();
        let height = parseFloat(await svgEl.getAttribute('height'));
        let width = parseFloat(await svgEl.getAttribute('width'));

        if (isNaN(height) || isNaN(width)) {
            throw new Error('SVG height or width is invalid.');
        }

        // Determine triangle direction
        switch (direction) {
            case "Pointing up":
                await expect(
                    x1 === width / 2 &&
                    y2 === y3 &&
                    y1 === height - y2 &&
                    x2 === width - x3
                ).to.equal(true, 'Triangle is not pointing up.');
                break;

            case "Pointing right":
                await expect(
                    y1 === height / 2 &&
                    x2 === x3 &&
                    x2 === y2 &&
                    x1 === width - x2 &&
                    y3 === height - y2
                ).to.equal(true, 'Triangle is not pointing right.');
                break;

            case "Pointing down":
                await expect(
                    x1 === width / 2 &&
                    y2 === y3 &&
                    y1 === height - y2 &&
                    x2 === width - x3 &&
                    x3 === y3
                ).to.equal(true, 'Triangle is not pointing down.');
                break;

            case "Pointing left":
                await expect(
                    y1 === height / 2 &&
                    x2 === x3 &&
                    x1 === y3 &&
                    x1 === width - x2 &&
                    y3 === height - y2
                ).to.equal(true, 'Triangle is not pointing left.');
                break;

            default:
                throw new Error(`Invalid direction: ${direction}`);
        }
    }

    async verifyRightTriangleDirection(direction) {
        // Retrieve the `points` attribute from the triangle
        let el = await this.getShapeTagUnderSvgClass();
        let pointsEl = await el.getAttribute('points');
    
        if (!pointsEl) {
            throw new Error('Triangle points attribute is missing or invalid.');
        }
    
        // Parse the points into coordinates
        const [v1, v2, v3] = pointsEl.split(" ");
        const [x1, y1] = v1.split(",").map(Number);
        const [x2, y2] = v2.split(",").map(Number);
        const [x3, y3] = v3.split(",").map(Number);
    
        // Retrieve SVG height and width
        let svgEl = await this.getSvgClass();
        let height = parseFloat(await svgEl.getAttribute('height'));
        let width = parseFloat(await svgEl.getAttribute('width'));
    
        if (isNaN(height) || isNaN(width)) {
            throw new Error('SVG height or width is invalid.');
        }
    
        // Determine triangle direction
        switch (direction) {
            case "Left-bottom cornered":
                await expect(
                    x1 === x2 &&
                    x2 === y2 &&
                    y1 === height - y2 &&
                    x2 === width - x3 &&
                    y1 === y3
                ).to.equal(true, 'Triangle is not left-bottom cornered.');
                break;
    
            case "Left-top cornered":
                await expect(
                    x1 === y1 &&
                    x1 === width - x2 &&
                    y3 === height - y2 &&
                    y1 === y2 &&
                    x1 === x3
                ).to.equal(true, 'Triangle is not left-top cornered.');
                break;
    
            case "Right-top cornered":
                await expect(
                    x3 === y3 &&
                    y1 === y3 &&
                    y1 === height - y2 &&
                    x2 === width - x3 &&
                    x1 === x2
                ).to.equal(true, 'Triangle is not right-top cornered.');
                break;
    
            case "Right-bottom cornered":
                await expect(
                    x2 === y3 &&
                    x1 === x3 &&
                    x1 === width - x2 &&
                    y3 === height - y2 &&
                    y1 === y2
                ).to.equal(true, 'Triangle is not right-bottom cornered.');
                break;
    
            default:
                throw new Error(`Invalid direction: ${direction}`);
        }
    }

    //End Action Helpers
}
