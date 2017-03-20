import { Injectable } from '@angular/core';
import { IInputItem } from './iinput-item';

@Injectable()
export class SharedService {

  public EXPRESSIONS: Array<String>;
  public inputList: Array<IInputItem> = [];

  constructor() {
    //'date', 'location-cordinates'
    this.EXPRESSIONS = ['number','boolean','image', 'sentence', 'name', 'zipcode','random-string', 'paragarph', 'email', 'uuid', 'address', 'number-array', 'string-array'];
  }

  public addInput(inputItem: IInputItem) {
    this.inputList.push(inputItem);
  }

  public removeInput(inputKey) {
    this.inputList = this.inputList.filter((inputItem: IInputItem) => {
      return inputItem.variable !== inputKey;
    });
  }

  public getInputList(): Array<IInputItem> {
    return this.inputList;
  }

  public getExpressionTypes(): Array<String> {
    return this.EXPRESSIONS;
  }

  public generateRandom(length: number): String {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  public generateRandomNumber(max?: number, min?: number): number {
    max = max ? max : 1000000;
    min = min ? min : 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public getRandomBoolean():boolean {
    return Math.random()>=0.5;
  }

}
