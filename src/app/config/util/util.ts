

import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class Util {

  /**
   * Formata data dd/mm/yyyy HH:mm:ss
   * @param dNow 
   */
  public retornaDataHoraStr(dNow: Date) {
    var localdate = dNow.getDate() + '/' + (dNow.getMonth() + 1) + '/' + dNow.getFullYear() + ' ' + dNow.getHours() + ':' + dNow.getMinutes();
    return localdate;
  }

  /**
   * Formata data dd/mm/yyyy HH:mm:ss
   * @param dNow 
   */
  public retornaDataStr(dNow: Date) {
    var localdate = this.tratarZeroDt(dNow.getDate()) + '/' + this.tratarZeroDt(dNow.getMonth() + 1) + '/' + dNow.getFullYear();
    return localdate;
  }


  public tratarZeroDt(num: any) {
    try {
      if (num < 10) {
        return "0" + num;
      }
      return "" + num;
    } catch (error) {

    }
    return num;
  }


  /**
   * retorna data atual
   */
  public getDataHora() {
    return new Date();
  }

  /**
   * calcula tempo total entre dh inicio e dh fim, retornando uma string
   * @param dhInicio igual a Date
   * @param dhFim igual a Date
   */
  public calcularTempoTotal(dhInicio: any, dhFim: any) {
    var ms = moment(dhFim).diff(dhInicio);
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    return s;
  }

  /***
   * Valida email, se email for valido retorna true
   */
  public validarEmail(email: string) {
    try {
      let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email && email.match(regexEmail)) {
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  /***
   * Valida cpf, se cpf for valido retorna true
   */
  public validarCPF(cpf: string) {
    try {
      let regexCpf = /^\d{11}$/;
      if (cpf && cpf.match(regexCpf)) {
        return this.cpfIsTrue(cpf);
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  public cpfIsTrue(strCPF: string) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;

    for (var i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (var i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
  }

  /***
   * Valida cnpj, se cnpj for valido retorna true
   */
  public validarCNPJ(cnpj: string) {
    try {
      let regexCnpj = /^\d{14}$/;
      if (cnpj && cnpj.match(regexCnpj)) {
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  public isCNPJ(CNPJ: string) {
    // considera-se erro CNPJ's formados por uma sequencia de numeros iguais
    if (CNPJ === "00000000000000" || CNPJ === "11111111111111" ||
      CNPJ === "22222222222222" || CNPJ === "33333333333333" ||
      CNPJ === "44444444444444" || CNPJ === "55555555555555" ||
      CNPJ === "66666666666666" || CNPJ === "77777777777777" ||
      CNPJ === "88888888888888" || CNPJ === "99999999999999" ||
      CNPJ.length != 14)
      return (false);

    var dig13, dig14;
    var sm, i, r, num, peso;

    // "try" - protege o código para eventuais erros de conversao de tipo (int)
    try {
      // Calculo do 1o. Digito Verificador
      sm = 0;
      peso = 2;
      for (i = 11; i >= 0; i--) {
        // converte o i-ésimo caractere do CNPJ em um número:
        // por exemplo, transforma o caractere '0' no inteiro 0
        // (48 eh a posição de '0' na tabela ASCII)
        num = (Number)(CNPJ.charCodeAt(i) - 48);
        sm = sm + (num * peso);
        peso = peso + 1;
        if (peso == 10)
          peso = 2;
      }

      r = sm % 11;
      if ((r == 0) || (r == 1))
        dig13 = '0';
      else dig13 = ((11 - r) + 48);

      // Calculo do 2o. Digito Verificador
      sm = 0;
      peso = 2;
      for (i = 12; i >= 0; i--) {
        num = (Number)(CNPJ.charCodeAt(i) - 48);
        sm = sm + (num * peso);
        peso = peso + 1;
        if (peso == 10)
          peso = 2;
      }

      r = sm % 11;
      if ((r == 0) || (r == 1))
        dig14 = '0';
      else dig14 = (Number)((11 - r) + 48);

      // Verifica se os dígitos calculados conferem com os dígitos informados.
      if ((dig13 == CNPJ.charAt(12)) && (dig14 == CNPJ.charAt(13)))
        return true;
      else
        return false;
    } catch (erro) {
      return false;
    }
  }

  /***
   * Valida string, se string for valido retorna true
   */
  public validarSTR(str: string) {
    try {
      let regexstr = /[^A-Za-z]*/;
      if (str && str.match(regexstr)) {
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }
  /***
   * Valida string ou numeros, se string ou numeros for valido retorna true
   */
  public validarSTRorNumber(STRorNumber: string) {
    try {
      let regexSTRorNumber = /[^0-9A-Za-z]*/;
      if (STRorNumber && STRorNumber.match(regexSTRorNumber)) {
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  /**
   * Remove acentos e espaços
   * @param value 
   * @returns 
   */
  public replaseAE(value: string) {
    try {
      value = value.normalize("NFD").replace(/[^a-zA-Zs]/g, "");
    } catch (error) {

    }
    return value;
  }

  public locateBr() {
    return {
      firstDayOfWeek: 1,
      dayNames: ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"],
      dayNamesShort: ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"],
      dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
      monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      monthNamesShort: ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"],
      today: 'Hoje',
      clear: 'Limpar'
    };
  }

  public formataDN(valor) {
    if (valor && valor.toString().length == 1)
      valor = "0" + valor;
    return valor;
  }

  public returnaDiaSemana(semana) {
    switch (semana) {
      case 1:
        return "SEG";
      case 2:
        return "TER";
      case 3:
        return "QUA";
      case 4:
        return "QUI";
      case 5:
        return "SEX";
      case 6:
        return "SAB";
      case 0:
        return "DOM";
    }
  }

  public ajustarValor(valor) {
    try {
      if (valor !== null && valor !== undefined && valor !== '0') {
        valor = valor.toFixed(2);
        let resultado = (valor + "").replace(".", ",") + "";
        if (resultado.indexOf(",") < 0) {
          return resultado + ",00";
        }
        return resultado;
      } else if (valor == '0') {
        return "0,00";
      }
    } catch (error) {
      return valor;
    }
    return valor;
  }

  /**
   * Passar paramentro data string de exemplo: DD/MM/YYYY, então converte para data
   */
  converterStringToDate(strData) {
    try {
      if (strData) {
        let dataString = strData.split("/");
        return new Date(dataString[2], dataString[1] - 1, dataString[0]);
      }
    } catch (error) {
    }
    return strData;
  }

}
