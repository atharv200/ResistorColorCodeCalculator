let DIGIT_COLORS = {
  0: { name: "Black",hex: "#000000"},
  1: { name: "Brown",hex: "#6d3a1f"},
  2: { name: "Red",hex: "#cc0000"},
  3: { name: "Orange",hex: "#ff6600"},
  4: { name: "Yellow",hex: "#ffcc00"},
  5: { name: "Green",hex: "#007a00"},
  6: { name: "Blue",hex: "#0000cc"},
  7: { name: "Violet",hex: "#7b00d4"},
  8: { name: "Grey",hex: "#888888"},
  9: { name: "White",hex: "#eeeeee"},
};

let MULTIPLIER_COLORS = {
  1:{name: "Black", hex: "#000000"},
  10:{name: "Brown",  hex: "#6d3a1f"},
  100:{name: "Red",    hex: "#cc0000"},
  1000:{name: "Orange", hex: "#ff6600"},
  10000:{name: "Yellow", hex: "#ffcc00"},
  100000:{name: "Green",  hex: "#007a00"},
  1000000:{name: "Blue",   hex: "#0000cc"},
  10000000:{name: "Violet", hex: "#7b00d4"},
  100000000:{name: "Grey", hex: "#888888"},
  1000000000:{name: "White", hex: "#eeeeee"},
  0.1:{name: "Gold",   hex: "#cfae5a"},
  0.01:{name: "Silver", hex: "#aaaaaa"},
};

let TOLERANCE_COLORS = {
  "±1%":{name: "Brown",  hex: "#6d3a1f"},
  "±2%":{name: "Red",    hex: "#cc0000"},
  "±0.05%":{name: "Orange", hex: "#ff6600"},
  "±0.02%":{name: "Yellow", hex: "#ffcc00"},
  "±0.5%":{name: "Green",  hex: "#007a00"},
  "±0.25%":{name: "Blue",   hex: "#0000cc"},
  "±0.1%":{name: "Violet", hex: "#7b00d4"},
  "±0.01%":{name: "Grey", hex: "#888888"},
  "±5%":{name: "Gold",   hex: "#cfae5a"},
  "±10%":{name: "Silver", hex: "#aaaaaa"},
}; 

let currentBands = 3;

const groupBand3 = document.getElementById("group-band3");
const groupBand4 = document.getElementById("group-band4");
const groupBand5 = document.getElementById("group-band5");
const band1 = document.getElementById("band1");
const band2 = document.getElementById("band2");
const band3 = document.getElementById("band3");
const band4 = document.getElementById("band4");
const band5 = document.getElementById("band5");
const selectBand1 = document.getElementById("select-band1");
const selectBand2 = document.getElementById("select-band2");
const selectBand3 = document.getElementById("select-band3");
const selectBand4 = document.getElementById("select-band4");
const selectBand5 = document.getElementById("select-band5");
const resultValue = document.getElementById("result-value");
const resultTol = document.getElementById("result-tolerance");
const btn3 = document.getElementById("btn-3band");
const btn4 = document.getElementById("btn-4band");
const btn5 = document.getElementById("btn-5band");
const label4 = document.querySelector("label[for='select-band4']")
const label3 = document.querySelector("label[for='select-band3']")
const label5 = document.querySelector("label[for='select-band5']")

function setBands(n) {
  currentBands = n;

  if(n == 3){
    btn3.classList.add("active");
  }else{
    btn3.classList.remove("active");
  }
  
  if(n == 4){
    btn4.classList.add("active")
  }else{
    btn4.classList.remove("active")
  }
  
  if(n == 5){
    btn5.classList.add("active")
  }else{
    btn5.classList.remove("active")
  }

  if (n === 3) {
    groupBand3.style.display = "none";  
    groupBand5.style.display = "none";
    groupBand4.style.display = "flex";
    label4.innerHTML = `BAND 3 <span class="label-hint">Multiplier</span>`;

    band3.setAttribute("opacity", "1");
    band4.setAttribute("opacity", "0");
    band5.setAttribute("opacity", "0");

    selectBand4.value = "";
    selectBand5.value = "";

  } else if (n === 4) {
    groupBand3.style.display = "none";
    groupBand4.style.display = "flex";
    groupBand5.style.display = "flex";
    label5.innerHTML = `BAND 4 <span class="label-hint">Tolerance</span>`;

    band3.setAttribute("opacity", "0");
    band4.setAttribute("opacity", "1");
    band5.setAttribute("opacity", "1");

    selectBand3.value = "";

  } else if (n === 5) {
    groupBand3.style.display = "flex";
    groupBand4.style.display = "flex";
    groupBand5.style.display = "flex";
    label4.innerHTML = `BAND 4 <span class="label-hint">Multiplier</span>`;
    label5.innerHTML = `BAND 5 <span class="label-hint">Tolerance</span>`;

    band3.setAttribute("opacity", "1");
    band4.setAttribute("opacity", "1");
    band5.setAttribute("opacity", "1");
  }
  calculate();
}

function updateBand(band, color) {
  if(color){
    band.setAttribute("fill", color);
  }
  else{
    band.setAttribute("fill", "#ccc");
  }
}

function formatOhms(value) {
  if(value >= 1_000_000_000){
    return (value / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "") + " GΩ";
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + " MΩ";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(2).replace(/\.?0+$/, "") + " kΩ";
  } else {
    return value.toFixed(2).replace(/\.?0+$/, "") + " Ω";
  }
}

function calculate() {
  const v1 = selectBand1.value;
  let temp1 = true;
  if(v1 !== "") {temp1 = DIGIT_COLORS[v1].hex;}
  else {temp1 = null;}
  updateBand(band1, temp1);

  const v2 = selectBand2.value;
  let temp2 = true;
  if(v2 !== "") {temp2 = DIGIT_COLORS[v2].hex;}
  else {temp2 = null;}
  updateBand(band2, temp2);

  if (currentBands === 3) {
    const mult = selectBand4.value;
    let temp = true;
    if(mult !== ""){temp = MULTIPLIER_COLORS[mult].hex;}
    else{temp = null;}
    updateBand(band3, temp);

    if (v1 == "" || v2 == "" || mult == "") {
      showPlaceholder();
      return;
    }

    const resistance = (parseInt(v1) * 10 + parseInt(v2)) * parseFloat(mult);
    showResult(resistance, null);

  } else if (currentBands === 4) {
    const mult = selectBand4.value;
    const tol  = selectBand5.value;
    updateBand(band4, mult !== "" ? MULTIPLIER_COLORS[mult]?.hex : null);
    updateBand(band5, tol  !== "" ? TOLERANCE_COLORS[tol]?.hex  : null);

    if (v1 === "" || v2 === "" || mult === "" || tol === "") {
      showPlaceholder();
      return;
    }

    const resistance = (parseInt(v1) * 10 + parseInt(v2)) * parseFloat(mult);
    showResult(resistance, tol);

  } else if (currentBands === 5) {
    const v3   = selectBand3.value;
    const mult = selectBand4.value;
    const tol  = selectBand5.value;
    updateBand(band3, v3   !== "" ? DIGIT_COLORS[v3]?.hex        : null);
    updateBand(band4, mult !== "" ? MULTIPLIER_COLORS[mult]?.hex : null);
    updateBand(band5, tol  !== "" ? TOLERANCE_COLORS[tol]?.hex   : null);
    if (v1 === "" || v2 === "" || v3 === "" || mult === "" || tol === "") {
      showPlaceholder();
      return;
    }
    const resistance = (parseInt(v1) * 100 + parseInt(v2) * 10 + parseInt(v3)) * parseFloat(mult);
    showResult(resistance, tol);
  }
}

function showResult(resistance, tolerance) {
  resultValue.classList.remove("error", "placeholder");
  resultValue.textContent = formatOhms(resistance);
  resultTol.innerHTML = tolerance? `Tolerance: <span>${tolerance}</span>`:`No Tolerance band`;
}

function showPlaceholder() {
  resultValue.classList.remove("error");
  resultValue.classList.add("placeholder");
  resultValue.textContent = "— Ω";
  resultTol.textContent = "Select all bands to calculate";
}

setBands(3);