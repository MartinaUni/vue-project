var arrP= []; var arrOP=[]; var arrC=[]; var arrV=[]; var arrOrg=[];
var orgMie=["Mar de la Vida OJSC", 979893388, "Oceanfront Oasis Inc Carriers", 8327];
import * as d3 from 'd3';

function contaC(varA, data3, target){
    for (var i = 0; i < data3.length; i++) {
        if(data3[i]["target"]==target) {
            if(arrP.includes(data3[i]["source"])){
                console.log(varA["Person"]);
                varA["Person"]++;
            }if(arrOP.includes(data3[i]["source"])){
                console.log("aaaaaaa");
                varA["Political organization"]++;
            }if(arrC.includes(data3[i]["source"])){
                console.log("aaaaaaa");
                varA["Location"]++;
            }if(arrV.includes(data3[i]["source"])){
                console.log("aaaaaaa");
                varA["Organizzation"]++;
            }
    }
}
    return varA;
}

function conta(varA, data3, source){
    for (var i = 0; i < data3.length; i++) {
        if(data3[i]["source"]==source) {
            if(arrP.includes(data3[i]["target"])){
                console.log(varA["Person"]);
                varA["Person"]++;
            }if(arrOP.includes(data3[i]["target"])){
                console.log("aaaaaaa");
                varA["Political organization"]++;
            }if(arrC.includes(data3[i]["target"])){
                console.log("aaaaaaa");
                varA["Location"]++;
            }if(arrV.includes(data3[i]["target"])){
                console.log("aaaaaaa");
                varA["Organizzation"]++;
            }
    }
}
    return varA;
}
export default function drawnChart2(data2, data3) {
    console.log(data3);
    console.log(data2);
    for (var i = 0; i < data2.length; i++) {
        if(data2[i]["type"]=="person"){
            arrP.push(data2[i]["id"]);
        }
        else if(data2[i]["type"]=="location"){
            arrC.push(data2[i]["id"]);
        }else if(data2[i]["type"]=="political_organization"){
            arrOP.push(data2[i]["id"]);
        }else if(data2[i]["type"]=="organization"){
            arrV.push(data2[i]["id"]);
        }
    } 
    
    var uniqueArray = ["Person", "Location", "Political organization", "Organizzation"];
      let array2Org1 = {};
      uniqueArray.forEach(key => {
        array2Org1[key] = 0;
      });
      var array2Org2 = {};
      uniqueArray.forEach(key => {
        array2Org2[key] = 0;
      });
      let array2Org3 = {};
      uniqueArray.forEach(key => {
        array2Org3[key] = 0;
      });
      let array2Org4 = {};
      uniqueArray.forEach(key => {
        array2Org4[key] = 0;
      });
    console.log(array2Org3);
    //ora faccio gli array per le quattro organizzazioni con funzione
    var arrayCont={};
    var arrayCont1={};
    var arrayCont2={};
    var arrayCont3={};
    arrayCont=conta(array2Org1,data3,orgMie[0]);
    arrayCont1=conta(array2Org2, data3, orgMie[1]);
    arrayCont2=conta(array2Org3, data3, orgMie[2]);
    arrayCont3=conta(array2Org4, data3, orgMie[3]);

    var array3 = Object.keys(arrayCont).map(key => ({
        source:orgMie[0],
        target: key,
        value: arrayCont[key]
      }));
      var array4 = Object.keys(arrayCont).map(key => ({
        source:orgMie[1],
        target: key,
        value: arrayCont1[key]
      }));
      var array5 = Object.keys(arrayCont).map(key => ({
        source:orgMie[2],
        target: key,
        value: arrayCont2[key]
      }));
      var array6 = Object.keys(arrayCont).map(key => ({
        source:orgMie[3],
        target: key,
        value: arrayCont3[key]
      }));
    console.log(array3,array4, array5, array6);
    const combinedData = [...array3, ...array4, ...array5, ...array6];

    //conta entità

    var uniqueArray2 =["Person", "Location", "Political organization", "Organizzation"];
      let a1 = {};
      uniqueArray2.forEach(key => {
        a1[key] = 0;
      });
      var a2 = {};
      uniqueArray2.forEach(key => {
        a2[key] = 0;
      });
      let a3 = {};
      uniqueArray2.forEach(key => {
        a3[key] = 0;
      });
      let a4 = {};
      uniqueArray2.forEach(key => {
        a4[key] = 0;
      });
    var arrayContE={};
    var arrayContE1={};
    var arrayContE2={};
    var arrayContE3={};
    arrayContE=contaC(a1,data3,orgMie[0]);
    arrayContE1=contaC(a2, data3, orgMie[1]);
    arrayContE2=contaC(a3, data3, orgMie[2]);
    arrayContE3=contaC(a4, data3, orgMie[3]);
    var array31 = Object.keys(arrayContE).map(key => ({
        source:key,
        target:orgMie[0],
        value: arrayCont[key]
      }));
    var array41 = Object.keys(arrayContE1).map(key => ({
        source:key,
        target:orgMie[1],
        value: arrayCont[key]
      }));
    var array51 = Object.keys(arrayContE2).map(key => ({
        source:key,
        target:orgMie[2],
        value: arrayCont[key]
      }));
    var array61 = Object.keys(arrayContE3).map(key => ({
        source:key,
        target:orgMie[3],
        value: arrayCont[key]
      }));
    const combinedData2 = [...array31, ...array41, ...array51, ...array61,...array3,...array4,...array5,...array6];
    return combinedData2;
    
};
