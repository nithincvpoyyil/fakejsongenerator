import { Component, OnInit, NgZone, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import * as Uuid from "uuid";
import { InputComponent } from './inputComponent/input.component';
import { IInputItem } from './coreModule/iinput-item';
import { IDictionary } from './coreModule/idictionary';
import { SharedService } from "./coreModule/shared.service";

declare var bootbox: any;
declare var obj: Object;
declare var faker: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    public items: Array<any>;
    public expressionTypes: Array<any>;
    public selectedExpression: string;
    public jsonGenerated: string = '';
    public inputList: Array<IInputItem> = [];
    public orginalJSONStringified: string = '';
    public limitValue: number = 5;

    @ViewChild('inputitemcontainer', { read: ViewContainerRef }) inputItemContainer;

    constructor(private zone: NgZone, private listService: SharedService, private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef) {
        this.items = [1, 2, 3, 4];
        this.expressionTypes = this.listService.getExpressionTypes();
    }

    public ngOnInit() {
        this.insert('name', 'name');
        this.insert('email', 'email');
    }

    public addInput(inputItem: IInputItem) {
        this.inputList.push(inputItem);
    }

    public removeInput(inputKey) {
        this.inputList = this.inputList.filter((inputItem: IInputItem) => {
            return inputItem.variable !== inputKey;
        });
        this.runJsonGenrateFunction();
    }

    public updateInputList(newInputItem: IInputItem, oldInputItem: IInputItem) {

        this.inputList.forEach((inputItem: IInputItem) => {
            if (inputItem.variable === oldInputItem.variable) {
                inputItem.variable = newInputItem.variable;
                inputItem.expression = newInputItem.expression;
            }
        });
    }

    public getInputList(): Array<IInputItem> {
        return this.inputList;
    }

    public createComponentProgramatically() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(InputComponent);
        const ref = this.inputItemContainer.createComponent(factory);
        let inputComponentInstance = ref.instance;
        this.listService.addInput(inputComponentInstance.getInputItem());
        ref.changeDetectorRef.detectChanges();
    }

    public insert(keyValue?: string, exprVal?: string) {
        this.expressionTypes = this.listService.getExpressionTypes();
        let expression = exprVal ? exprVal : 'random-string';
        let variable = keyValue ? keyValue : 'new-key-' + this.listService.generateRandom(8);
        let inputItem: IInputItem = { 'expression': expression, 'variable': variable };
        this.addInput(inputItem);
        this.runJsonGenrateFunction();
    }

    public downloadJson() {

        let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(this.orginalJSONStringified);
        let dlAnchorElem = document.getElementById('dummy-anchor-element-to-download');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "fakeJSON.json");
        dlAnchorElem.click();
    }

    public copyToClipBoard() {
        let element = <HTMLInputElement><any>document.querySelector('#code-generated-unique-id');
        element.select();
        document.execCommand('copy');
    }

    public onUpdateOfInputItem(newInputItem: IInputItem, oldInputItem: IInputItem) {
        this.updateInputList(newInputItem, oldInputItem);
        this.runJsonGenrateFunction();
    }

    public runJsonGenrateFunction() {
        let jsonObjectArray: Object[] = [];
        if (this.limitValue > 1000) {
            this.limitValue = 1000;
            bootbox.alert('Warning: Exceeded the maximum limit (<1000)');
        }
        for (let i = 0; i < this.limitValue; i++) {
            jsonObjectArray.push(this.generateJson());
        }
        this.appendAndUpdateJSON(jsonObjectArray);
    }

    public generateJson() {

        let jsonObj = new Object();
        this.inputList.forEach((inputItem: IInputItem) => {

            if (inputItem.expression === 'number') {
                jsonObj[inputItem.variable.toString()] = this.listService.generateRandomNumber(1, 10000000);
            } else if (inputItem.expression === 'image') {
                jsonObj[inputItem.variable.toString()] = faker.Image.imageUrl();
            } else if (inputItem.expression === 'sentence') {
                jsonObj[inputItem.variable.toString()] = faker.Lorem.sentence();
            } else if (inputItem.expression === 'name') {
                jsonObj[inputItem.variable.toString()] = faker.Name.findName();
            } else if (inputItem.expression === 'zipcode') {
                jsonObj[inputItem.variable.toString()] = faker.Address.zipCode();
            } else if (inputItem.expression === 'location-cordinates') {
                jsonObj[inputItem.variable.toString()] = '12,12';
            } else if (inputItem.expression === 'date') {
                jsonObj[inputItem.variable.toString()] = '27/05/1991';
            } else if (inputItem.expression === 'random-string') {
                jsonObj[inputItem.variable.toString()] = this.listService.generateRandom(12);
            } else if (inputItem.expression === 'paragraph') {
                jsonObj[inputItem.variable.toString()] = faker.Lorem.paragarph();
            } else if (inputItem.expression === 'email') {
                jsonObj[inputItem.variable.toString()] = faker.Internet.email();
            } else if (inputItem.expression === 'uuid') {
                jsonObj[inputItem.variable.toString()] = Uuid.v4();
            } else if (inputItem.expression === 'address') {
                jsonObj[inputItem.variable.toString()] = faker.Address.streetAddress();
            } else if (inputItem.expression === 'number-array') {
                jsonObj[inputItem.variable.toString()] = this.getStringOrNumberArray(false);
            } else if (inputItem.expression === 'string-array') {
                jsonObj[inputItem.variable.toString()] = this.getStringOrNumberArray(true);
            } else if (inputItem.expression === 'boolean') {
                jsonObj[inputItem.variable.toString()] = this.listService.getRandomBoolean();
            } else {
                jsonObj[inputItem.variable.toString()] = Uuid.v4();
            }
        });
        return jsonObj;
    }

    public getStringOrNumberArray(isString: boolean): any[] {

        let limit = this.listService.generateRandomNumber(3, 10);
        let array: any[] = [];

        for (let i = 0; i < limit; i++) {
            if (isString) {
                array.push(this.listService.generateRandom(10));
            } else {
                array.push(this.listService.generateRandomNumber(1, 9999));
            }
        }
        return array;
    }

    public syntaxHighlight(jsonString: string): string {
        // http://jsfiddle.net/KJQ9K/554/
        // http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
        jsonString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        let regex =/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;
        return jsonString.replace(regex, (match) => {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    public appendAndUpdateJSON(jsonObject: any) {

        try {
            let str: string = JSON.stringify(jsonObject, null, 2);
            this.orginalJSONStringified = str;
            this.jsonGenerated = this.syntaxHighlight(str);
        } catch (error) {
            this.jsonGenerated = '';
        }


    }

    public showWithLovePopup() {

        bootbox.alert({
            message: 'Thank you for using the app, Kindly share your thoughts and feedbacks!',
            backdrop: true
        });
    }

}
