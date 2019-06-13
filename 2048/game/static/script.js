var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var rozmiarWejscie = document.getElementById('rozmiar');
var zmienRozmiar = document.getElementById('zmien-rozmiar');
var odswiez = document.getElementById('odswiez');
var oknoWynik = document.getElementById('wynik');
var wynik = 0;
var rozmiar = 4;
var szerokosc = canvas.width / rozmiar - 6;
var komorki = [];
var rozmiarCzcionki;
var porazka = false;
startGry();


odswiez.onclick=function(){
	location.reload();
	
	
}
zmienRozmiar.onclick = function () {
  if (rozmiarWejscie.value >= 2 && rozmiarWejscie.value <= 20) {
    rozmiar = rozmiarWejscie.value;
    szerokosc = canvas.width / rozmiar - 6;
    console.log(rozmiarWejscie.value);
    canvasClean();
    startGry();
  }
}

function komorka(wiersz, kolumna) {
  this.value = 0;
  this.x = kolumna * szerokosc + 5 * (kolumna + 1); //SZERokosc ramki to 5
  this.y = wiersz * szerokosc + 5 * (wiersz + 1); //to tylko wspolrzedne komek
}

function stworzKomorki() {
  var i, j;
  for(i = 0; i < rozmiar; i++) {
    komorki[i] = [];
    for(j = 0; j < rozmiar; j++) {
      komorki[i][j] = new komorka(i, j);
    }
  }
}

function rysujKomorke(komorka) {
  ctx.beginPath();			
  ctx.rect(komorka.x, komorka.y, szerokosc, szerokosc);			//rysuje komorka
  switch (komorka.value){
    case 0 : ctx.fillStyle = '#AAD4FE'; break;
    case 2 : ctx.fillStyle = '#8C5C8F'; break;
    case 4 : ctx.fillStyle = '#4B0787'; break;
    case 8 : ctx.fillStyle = '#090787'; break;
    case 16 : ctx.fillStyle = '#11A5E1'; break;
    case 32 : ctx.fillStyle = '#129550'; break;
    case 64 : ctx.fillStyle = '#06BF11'; break;
    case 128 : ctx.fillStyle = '#5AE207'; break;
    case 256 : ctx.fillStyle = '#C1EE07'; break;
    case 512 : ctx.fillStyle = '#FFA80E'; break;
    case 1024 : ctx.fillStyle = '#D24F04'; break;
    case 2048 : ctx.fillStyle = '#F30303'; break;
    case 4096 : ctx.fillStyle = '#6C3F54'; break;
    default : ctx.fillStyle = '#ff0080';
  }
  ctx.fill();													//wypelnia kolorem
  if (komorka.value) {
    rozmiarCzcionki = szerokosc / 2;
    ctx.font = rozmiarCzcionki + 'px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(komorka.value, komorka.x + szerokosc / 2, komorka.y + szerokosc / 1.5);
  }
}

function canvasClean() {
  ctx.clearRect(0, 0, 500, 500);
}




document.onkeydown = function (event) {
  if (!porazka) {
    if (event.keyCode === 38 || event.keyCode === 87) {
      ruszWgore(); 
    } else if (event.keyCode === 39 || event.keyCode === 68) {
      ruszWprawo();
    } else if (event.keyCode === 40 || event.keyCode === 83) {
      ruszWdol(); 
    } else if (event.keyCode === 37 || event.keyCode === 65) {
      ruszWlewo(); 
    }
    oknoWynik.innerHTML = 'wynik : ' + wynik;
  }
}

function startGry() {
  stworzKomorki();
  rysujWszystkieKomorki();
  wklejNowaKomorke();
  wklejNowaKomorke();
 
  
}

function koniecGry() {
  canvas.style.opacity = '0.5';
  porazka = true;
  alert("Game over. You scored "+wynik +" points!");
  //window.open("index.html", "name", 'width=400,height=200,scrollbars=yes');
}

function rysujWszystkieKomorki() {                                //rysuje wszystkie komorki na mapie 
  var i, j;
  for(i = 0; i < rozmiar; i++) {
    for(j = 0; j < rozmiar; j++) {
      rysujKomorke(komorki[i][j]);
    }
  }
}

function wklejNowaKomorke() {
  var policzWolne = 0;
  var i, j;
  for(i = 0; i < rozmiar; i++) {
    for(j = 0; j < rozmiar; j++) {
      if(!komorki[i][j].value) {
        policzWolne++;											//przelicza ile jest wolnych komorek
      }
    }
  }
  if(!policzWolne) {
    koniecGry();												//jesli 0 to koniec gry
    return;
  }
  while(true) {
    var wiersz = Math.floor(Math.random() * rozmiar);
    var kolumna = Math.floor(Math.random() * rozmiar);						//losuje komorke
    if(!komorki[wiersz][kolumna].value) {									// jesli jest pusta to losuje wartosc 2  lub 4 
      komorki[wiersz][kolumna].value = 2 * Math.ceil(Math.random() * 2);
      rysujWszystkieKomorki();
      return;
    }
  }
}

function ruszWprawo () {
  var i, j;
  var kolumna;
  for(i = 0; i < rozmiar; i++) {
    for(j = rozmiar - 2; j >= 0; j--) {									//zaczyna przeszukiwanie od prawej strony
      if(komorki[i][j].value) {
        kolumna = j;
        while (kolumna + 1 < rozmiar) {
          if (!komorki[i][kolumna + 1].value) {							//jak wolne miejsce po prawej to przepisuje
            komorki[i][kolumna + 1].value = komorki[i][kolumna].value;
            komorki[i][kolumna].value = 0;
            kolumna++;
          } else if (komorki[i][kolumna].value == komorki[i][kolumna + 1].value) {					//sprawdza czy wartosc po prawej jest rowna wartosci komorki,jesli tak to mnozy
            komorki[i][kolumna + 1].value *= 2;
            wynik +=  komorki[i][kolumna + 1].value;
            komorki[i][kolumna].value = 0;
			
            break;
          } else {															//jesli inna wartosc po prawej
            break;
          }
        }
      }
    }
  }
  wklejNowaKomorke();
}


function ruszWlewo() {
  var i, j;
  var kolumna;
  for(i = 0; i < rozmiar; i++) {
    for(j = 1; j < rozmiar; j++) {										//zaczyna od lewej
      if(komorki[i][j].value) {
        kolumna = j;
        while (kolumna - 1 >= 0) {
          if (!komorki[i][kolumna - 1].value) {							//jesli  komorka po lewej jest pusta to przepisuje i idzie dalej w lewo
            komorki[i][kolumna - 1].value = komorki[i][kolumna].value;
            komorki[i][kolumna].value = 0;
            kolumna--;
          } else if (komorki[i][kolumna].value == komorki[i][kolumna - 1].value) {		// jesli komorka po lewej taka sama wartosc
            komorki[i][kolumna - 1].value *= 2;
            wynik +=   komorki[i][kolumna - 1].value;
            komorki[i][kolumna].value = 0;
            break;
          } else {
            break; 																	//jesli inna wartosc po lewej
          }
        }
      }
    }
  }
  wklejNowaKomorke();
}

function ruszWgore() {
  var i, j, wiersz;
  for(j = 0; j < rozmiar; j++) {
    for(i = 1; i < rozmiar; i++) {
      if(komorki[i][j].value) {
        wiersz = i;
        while (wiersz > 0) {
          if(!komorki[wiersz - 1][j].value) {								//jesli komorka na gorze jest pusta to przesuwa i idzie dalej do gory
            komorki[wiersz - 1][j].value = komorki[wiersz][j].value;
            komorki[wiersz][j].value = 0;
            wiersz--;
          } else if (komorki[wiersz][j].value == komorki[wiersz - 1][j].value) { 		//jesli takie same to mnozy i zeruje poprzednia 
            komorki[wiersz - 1][j].value *= 2;
            wynik +=  komorki[wiersz - 1][j].value;
            komorki[wiersz][j].value = 0;
            break;
          } else {
            break; 																					// inna wartosc na gorze 
          }
        }
      }
    }
  }
  wklejNowaKomorke();
}

function ruszWdol() {
  var i, j, wiersz;
  for(j = 0; j < rozmiar; j++) {
    for(i = rozmiar - 2; i >= 0; i--) { 												// zaczyna przesukiwanie od dolu 
      if(komorki[i][j].value) {
        wiersz = i;
        while (wiersz + 1 < rozmiar) {
          if (!komorki[wiersz + 1][j].value) {												//typowo jesli nizej jest pusta to przepisuje i idze dalej do dolu
            komorki[wiersz + 1][j].value = komorki[wiersz][j].value;
            komorki[wiersz][j].value = 0;
            wiersz++;
          } else if (komorki[wiersz][j].value == komorki[wiersz + 1][j].value) {			//taka sama wartosc i mnozenie 
            komorki[wiersz + 1][j].value *= 2;
            wynik +=  komorki[wiersz + 1][j].value;
            komorki[wiersz][j].value = 0;
            break;
          } else {																				//brak akcji
            break; 
          }
        }
      }
    }
  }
  wklejNowaKomorke();
}
