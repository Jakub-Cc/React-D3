Moja pierwsza strona z wykorzystaniem react oraz d3 na potrzeby projektu z technologi webowej


zmiany: 
-dodano dzialajace menu z zakladkami
-umieszczono w kazdej wykres 
-dodano do pierwszego wykresu punkty pomiarowe wraz z tooltipem wyswietlajacym sie po najechaniu na nie
-utworzono wykres drugi slupkowy - dodano tool tip do niego
-w trakcie tworzenia spiner sygnalizujacy ladowanie danych, oraz graficzne przejscia pomiedzy wykresami po zaladowaniu danych

uwagi:
d3 - aby wybrac mniejsce w ktorym wyswietli sie element nalezy odwolac sie przez id elementu
a d3.select( typ elementu np div ) zwraca pierwszy element tego typu, wiec nie nadaje sie do wstawiania wiel wykresow na jedna strone
d3.select( '#Id' ) zwraca element o podanym id  
d3.selectAll ('*') zwracawszystkie elementy;
 