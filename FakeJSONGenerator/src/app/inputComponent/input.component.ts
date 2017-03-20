import { Component, OnInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { SharedService } from "../coreModule/shared.service";
import { IInputItem } from '../coreModule/iinput-item';
import * as Uuid from "uuid";


declare var bootbox: any;

@Component({
    selector: 'input-item',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

    @Input() variable: String;
    @Input() expression: String;
    @Output() onInputItemChange: EventEmitter<IInputItem> = new EventEmitter<IInputItem>();
    @Output() onDeleteItem:EventEmitter<IInputItem> = new EventEmitter<IInputItem>();
    public expressionTypes: Array<String>;


    public constructor(private zone: NgZone, private listService: SharedService) {
        this.expressionTypes = this.listService.getExpressionTypes();
    }

    public ngOnInit() {

    }

    public setVariable(variable: String) {
        this.variable = variable;
    }

    public getVariable(): String {
        return this.variable;
    }

    public setExpression(expr: String) {
        this.expression = expr;
    }

    public getExpression(): String | String[] {
        return this.expression;
    }

    public updateData() {
        let inputItem: IInputItem = { 'expression': this.expression, 'variable': this.variable };
        this.onInputItemChange.emit(inputItem);
    }

    public deleteItem(){
         let inputItem: IInputItem = { 'expression': this.expression, 'variable': this.variable };
        this.onDeleteItem.emit(inputItem);
    }


    public printvals(args: any) {
        args = args ? args : '';
        console.log(args, '---', this.expression, '---', this.variable, '---');
    }

}
