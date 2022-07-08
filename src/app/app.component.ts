import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as QRcode from 'qrcode';
import { CRC } from 'crc-full';
import * as crc from 'crc';
import * as $ from 'jquery';
import * as Inputmask from "inputmask";
import { Util } from './config/util/index';

let thisObj = null;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'QRcode-PIX';

  imgBase64: any = "assets/img/logopix.png";

  pixQrcodeForm;
  linkQrcodeForm;

  isPixQrCodeForm = true;
  isLinkQrCodeForm = false;

  selectedTipoForm: string = 'pix';

  tipoChaveSelected: any = 'CPF';

  selectedLinkQrCode: any = "";

  constructor(private formBuilder: FormBuilder,
    private util: Util) {
    thisObj = this;

    this.newForms();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    $('#selectedLink').click(function (e) {
      setTimeout(() => {
        $(e.target).select();  
        document.execCommand('copy');
      }, 100);
    });
  }

  setMasks() {
    setTimeout(() => {
      try {
        $(document).ready(function() {
          console.log(Inputmask().mask);
          setTimeout(() => {
            Inputmask().mask(document.querySelectorAll("input"));
          }, 100);

        });
      } catch (error) {

      }
    }, 100);
  }

  newForms() {
    this.pixQrcodeForm = this.formBuilder.group({
      tipo_chave: ['CPF', Validators.required],
      cpf: ['', Validators.required],
      cnpj: ['', Validators.required],
      tel: ['', Validators.required],
      email: ['', Validators.required],
      outro: ['', Validators.required],
      nome: ['', Validators.required],
      desc: ['', Validators.required],
      cidade: ['', Validators.required],
      cep: ['', Validators.required],
    });

    this.linkQrcodeForm = this.formBuilder.group({
      link: ['', Validators.required]
    });
  }

  gerarQrCodePix() {
    var arrayCampo = ["cpf", "tel", "email", "outro", "nome", "desc", "cep", "cidade"];
    var isRequire = false;
    let chave = "";
    for (let i = 0; i < arrayCampo.length; i++) {
      const el = arrayCampo[i];
      if (el === "cpf" || el === "tel" || el === "email" || el === "outro") {
        if (this.pixQrcodeForm.value['tipo_chave'].toString().toLowerCase() === el.toLowerCase() && (this.pixQrcodeForm.value[el] === "" || this.pixQrcodeForm.value[el] === null || this.pixQrcodeForm.value[el] === undefined)) {
          this.isValidade(el, false);
          isRequire = true;
        }
        if (this.pixQrcodeForm.value['tipo_chave'].toString().toLowerCase() === el.toLowerCase()) {
          chave = this.pixQrcodeForm.value[el];
        }
        if (this.pixQrcodeForm.value['tipo_chave'].toString().toLowerCase() === el.toLowerCase() && el === "cpf") {
          var isCpf = this.util.validarCPF(this.pixQrcodeForm.value[el]);
          if (!isCpf) {
            this.isValidade(el, false);
            isRequire = true;
          }
        }
        if (this.pixQrcodeForm.value['tipo_chave'].toString().toLowerCase() === el.toLowerCase() && el === "email") {
          var isEmail = this.util.validarEmail(this.pixQrcodeForm.value[el]);
          if (!isEmail) {
            this.isValidade(el, false);
            isRequire = true;
          }
        }
      } else {
        if (this.pixQrcodeForm.value[el] === "" || this.pixQrcodeForm.value[el] === null || this.pixQrcodeForm.value[el] === undefined) {
          this.isValidade(el, false);
          isRequire = true;
        } else {
          this.isValidade(el, true);
        }
        if (el === "cidade") {
          var cidade = this.util.replaseAE(this.pixQrcodeForm.value[el]);
          this.pixQrcodeForm.value[el] = cidade;
        }
      }
    }
    if (isRequire) {
      return;
    } else {

    }
    console.log(this.pixQrcodeForm.value);
    var objPix = {
      merchant_gui_chave: chave,
      merchant_gui_desc: this.pixQrcodeForm.value['desc'],
      merchant_name_r: this.pixQrcodeForm.value['nome'],
      merchant_city_r: this.pixQrcodeForm.value['cidade'],
      postal_code_r: this.pixQrcodeForm.value['cep'],
      aditional_data_field_template_r: "2022"
    };
    this.gerarChavePixQrCode(objPix);
  }

  gerarQrCodeLink() {
    if (this.linkQrcodeForm.value['link'] === "" || this.linkQrcodeForm.value['link'] === null || this.linkQrcodeForm.value['link'] === undefined) {
      this.isValidade('link', false);
      return;
    } else {
      this.gerarQRcode(this.linkQrcodeForm.value['link']);
    }
  }

  isValidade(id, validade) {
    if (id) {
      if (validade) {
        $('#' + id).removeClass('isRequire').addClass('isNotRequire');
      } else {
        $('#' + id).removeClass('isNotRequire').addClass('isRequire');
      }
    }
  }

  selectedTipo(value: any, chave: any = null) {
    if (value) {
      this.tipoChaveSelected = value;
      //this.setMasks();
    }
  }

  selectedTipoFormulario(value: string = "") {
    console.log('value', value);
    if (value.toLowerCase() == "pix".toLowerCase()) {
      this.isPixQrCodeForm = true;
      this.isLinkQrCodeForm = false;
    } else if (value.toLowerCase() === "link".toLowerCase()) {
      this.isPixQrCodeForm = false;
      this.isLinkQrCodeForm = true;
    }
  }

  gerarChavePixQrCode(objPix) {
    let strPix = "";
    let templateHex = "";

    var obj = {
      payload_format_indicator: "000201",
      merchant_account_information: "26",
      merchant_gui_00: "br.gov.bcb.pix",
      merchant_gui_chave: objPix.merchant_gui_chave,
      merchant_gui_desc: objPix.merchant_gui_desc,
      merchant_category_code: "52040000",
      transaction_currency: "5303986",
      country_code: "5802BR",
      merchant_name: "59",
      merchant_name_r: objPix.merchant_name_r,
      merchant_city: "60",
      merchant_city_r: objPix.merchant_city_r,
      postal_code: "61",
      postal_code_r: objPix.postal_code_r,
      aditional_data_field_template: "62",
      aditional_data_field_template_r: objPix.aditional_data_field_template_r,
      crc16: "6304"
    };

    var resultPix = "";
    resultPix = resultPix + obj.payload_format_indicator;

    obj.merchant_gui_00 = "00" + this.validarCode(obj.merchant_gui_00.length) + obj.merchant_gui_00;
    obj.merchant_gui_chave = "01" + this.validarCode(obj.merchant_gui_chave.length) + obj.merchant_gui_chave;
    obj.merchant_gui_desc = "02" + this.validarCode(obj.merchant_gui_desc.length) + obj.merchant_gui_desc;

    resultPix = resultPix + obj.merchant_account_information + this.validarCode(obj.merchant_gui_00.length + obj.merchant_gui_chave.length + obj.merchant_gui_desc.length);

    resultPix = resultPix + obj.merchant_gui_00 + obj.merchant_gui_chave + obj.merchant_gui_desc;

    resultPix = resultPix + obj.merchant_category_code;

    resultPix = resultPix + obj.transaction_currency;

    resultPix = resultPix + obj.country_code;

    resultPix = resultPix + obj.merchant_name + this.validarCode(obj.merchant_name_r.length) + obj.merchant_name_r;

    resultPix = resultPix + obj.merchant_city + this.validarCode(obj.merchant_city_r.length) + obj.merchant_city_r;

    resultPix = resultPix + obj.postal_code + this.validarCode(obj.postal_code_r.length) + obj.postal_code_r;

    obj.aditional_data_field_template_r = "05" + this.validarCode(obj.aditional_data_field_template_r.length) + obj.aditional_data_field_template_r;

    resultPix = resultPix + obj.aditional_data_field_template + this.validarCode(obj.aditional_data_field_template_r.length) + obj.aditional_data_field_template_r;

    resultPix = resultPix + obj.crc16;

    templateHex = resultPix;

    //console.log("templateHex: " + templateHex);

    let crcc = new CRC("CRC16", 16, 0x1021, 0xFFFF, 0x0000, false, false);
    var computed_crc = crcc.compute(require('buffer').Buffer.from(templateHex, "ascii")).toString(16).toUpperCase();

    //console.log("hash 1: " + computed_crc);

    let hashcode = crc.crc16ccitt(templateHex).toString(16).toUpperCase();

    //console.log("hash 2: " + hashcode);

    resultPix = resultPix + computed_crc;

    //console.log("resultPix: " + resultPix);

    this.gerarQRcode(resultPix);
  }

  gerarQRcode(text) {

    this.selectedLinkQrCode = text;

    var opts = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      quality: 0.3,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    }

    QRcode.toDataURL(text, opts, function(err, url) {
      thisObj['imgBase64'] = url;
      //console.log(url)
    })

    // With async/await
    const generateQR = async text => {
      try {
        //console.log('aqui');
        //console.log(await QRcode.toDataURL(text))
      } catch (err) {
        //console.error(err)
      }
    }
  }

  validarCode(valor: number) {
    if (valor < 10) {
      return "0" + valor;
    }
    return "" + valor;
  }

  downloadQrCode() {
    var el = $("#idQrCodeImg")[0].currentSrc;
    console.log(el);
    let a = document.createElement('a');
    a.href = el;
    a.download = el;
    a.name = "qrcode"
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  copyLink() {
    $("#selectedLink").click();
  }


  compartilhar(key) {
    switch (key) {
      case 'whatsapp':
        window.open("https://api.whatsapp.com/send?text=Ficou fácil criar QRCode para transferência Pix! Fácil só acessar este link: http://localhost:4200", '_blank');
        break;
    
      default:
        break;
    }
  }

}
