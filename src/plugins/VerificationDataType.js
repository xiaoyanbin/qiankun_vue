/**
 * 封装类型的判断 工具
 * VerificationDataType
 * */
export default {
    isNumber(num){
        let number = Number(num);
        if(!isNaN(number) && this.getVariableType(number).indexOf('Number') > -1){
            return number
        }
        return false;
    },
    isString(Variable){
        return this.getVariableType(Variable).indexOf('String') > -1
    },
    isBoolean(Variable){
        return this.getVariableType(Variable).indexOf('Boolean') > -1
    },
    isSymbol(Variable){
        return this.getVariableType(Variable).indexOf('Symbol') > -1
    },
    isUndefined(Variable){
        return this.getVariableType(Variable).indexOf('Undefined') > -1
    },
    isNull(Variable){
        return this.getVariableType(Variable).indexOf('Null') > -1
    },
    isFunction(Variable){
        return this.getVariableType(Variable).indexOf('Function') > -1
    },
    isDate(Variable){
        return this.getVariableType(Variable).indexOf('Date') > -1
    },
    isArray(Variable){
        return this.getVariableType(Variable).indexOf('Array') > -1
    },
    isRegExp(Variable){
        return this.getVariableType(Variable).indexOf('RegExp') > -1
    },
    isError(Variable){
        return this.getVariableType(Variable).indexOf('Error') > -1
    },
    isHTMLDocument(Variable){
        return this.getVariableType(Variable).indexOf('HTMLDocument') > -1
    },
    getVariableType(variable){
        return Object.prototype.toString.call(variable);
    }
}
