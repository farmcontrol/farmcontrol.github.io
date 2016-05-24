#include <LiquidCrystal.h>
#include <DHT.h>
#include <SoftwareSerial.h>

LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
DHT dht21(A0, DHT21);
DHT dht11(A2, DHT11);

float outHumidity = 0, outTemperature = 0; 
float inHumidity  = 0, inTemperature = 0;

#define DEBUG true //Mostrar mensagens de output (debug)
#define _baudrate 9600
#define _rxpin 6
#define _txpin 7
SoftwareSerial esp8266(_rxpin, _txpin);

//*-- IoT Informationw
#define SSID "RODRIGO"
#define PASS "venussalamandra"
#define IP "184.106.153.149" // ThingSpeak IP Address: 184.106.153.149

// GET /update?key=[THINGSPEA_KEY]&field1=[data 1]&field2=[data 2]...;
String GET = "GET /update?key=FDKEA0YLYP6XTZJM";

void setup() {
  Serial.begin(_baudrate);
  esp8266.begin(_baudrate);
  lcd.begin(16, 2); //Inicializa o LCD
  lcd.setCursor(0,0);
  lcd.print("Carregando...");
  dht21.begin();
  dht11.begin();
  
  sendData("AT\r\n", 3000, DEBUG);
  delay(1000);

  //Conecta à rede wireless
  sendData("AT+CWJAP=\"Nappi\",\"nappi123\"\r\n", 2000, DEBUG);
  delay(1000);

  sendData("AT+CWMODE=1\r\n", 1000, DEBUG);
  delay(1000);
  
  //Mostra o endereco IP
  sendData("AT+CIFSR\r\n", 1000, DEBUG);
  delay(1000);

  //Configura para única conexão (0 = única, 1 = múltiplas)
  sendData("AT+CIPMUX=0\r\n", 1000, DEBUG);
  delay(1000);
  
}

void loop() {
  // umidade interna
  inHumidity = analogRead(A1);
  inHumidity = map(inHumidity, 0, 1023, 0, 100);
  // temperatura interna
  inTemperature = dht11.readTemperature();

  // umidade externa
  outHumidity = dht21.readHumidity();
  // temperatura externa
  outTemperature = dht21.readTemperature();

  Serial.print("Temperatra Interna: ");
  Serial.print(inTemperature);
  Serial.print("| Umidade Interna: ");
  Serial.println(inHumidity);

  Serial.print("Temperatra Externa: ");
  Serial.print(outTemperature);
  Serial.print("| Umidade Externa: ");
  Serial.println(outHumidity);
  
  lcd.setCursor(0,0);
  lcd.print("INT:");
  lcd.setCursor(0,1);
  lcd.print("EXT:");
  // Exibe os dados referentes ao clima INTERNO
  lcd.setCursor(4,0);
  lcd.print(inTemperature);
  lcd.setCursor(8,0);
  lcd.print("C");
  lcd.setCursor(9,0);
  lcd.print("|");
  lcd.setCursor(10,0);
  lcd.print(inHumidity);
  lcd.setCursor(14,0);
  lcd.print("%");

  // Exibe os dados referentes ao clima EXTERNO
  lcd.setCursor(4,1);
  lcd.print(outTemperature);
  lcd.setCursor(8,1);
  lcd.print("C");
  lcd.setCursor(9,1);
  lcd.print("|");
  lcd.setCursor(10,1);
  lcd.print(outHumidity);
  lcd.setCursor(14,1);
  lcd.print("%");

  String extTemp = String(outTemperature);
  String extHum    = String(outHumidity);
  String inTemp  = String(inTemperature);
  String inHum     = String(inHumidity);

  updateTS(extTemp, extHum, inTemp, inHum);
  delay(60000); //
}

//Rotina para atualizar o thingspeak de acordo com strings parametrizadas...
void updateTS(String extTemp, String extHum, String inTemp, String inHum){
  
  //Configurações do ESP 8266
  String cmd = "AT+CIPSTART=\"TCP\",\"";//Configurando a conexão TCP
  cmd += IP;
  cmd += "\",80\r\n";

  sendData(cmd, 2000, DEBUG);
  delay(1000);
  
  

  String getCommand = GET + "&field1=" + extTemp + "&field2=" + extHum + "&field3=" + inTemp +"&field4=" + inHum + "\r\n"; 

  /*"Field 1" : "Temperatura Externa",
    "Field 2" : "Umidade Externa",
    "Field 3" : "Temperatura Interna",
    "Field 4" : "Umidade Interna" */


  //Query de GET para o thingspeak
  //"&fieldN=" + "valor" (N = campo do channel)

  cmd = "AT+CIPSEND=";
  cmd += String(getCommand.length());
  cmd += "\r\n"; //Montando tamanho da query para o módulo (necessário para enviar um GET pro thingspeak)

  sendData(cmd, 2000, DEBUG);
  delay(1000);   //Enviando tamanho da query para o módulo e esperando aprovação (">") 

  sendData(getCommand, 2000, DEBUG); //Enviando comando de GET para o thingspeak
  delay(20000);  //Tempo entre sincronizações no thingspeak
}


String sendData(String command, const int timeout, boolean debug){

  //Enviar comandos para o módulo WiFi
  String response = "";
  esp8266.print(command);
  long int time = millis();
  while ((time + timeout) > millis()){
    while (esp8266.available()){
      //Rotina que lê os comandos, letra por letra.
      char c = esp8266.read(); //Lendo a próxima letra do comando.
      response += c; //Acumulando comando numa String para mostrar no output
    }
  }
  if (debug){
    Serial.print(response);
  }
  return response;
}
