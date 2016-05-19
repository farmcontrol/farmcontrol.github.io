#include <SoftwareSerial.h>
#include <DHT.h>
#include <LiquidCrystal.h>

float outHumidity = 0, outTemperature = 0, inTemperature = 0, inHumidity = 0;

// Define o pino analogico para ligado do DH21
DHT dht(A1,DHT21);

// Define os pinos que serão utilizados na ligação do LCD
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
   
void setup(){
  Serial.begin(9600); // inicializa a comunicação serial
  lcd.begin(16, 2); // inicializa o LCD
  lcd.setCursor(0,0);
  lcd.print("INT:");
  lcd.setCursor(0,1);
  lcd.print("EXT:");
  dht.begin();
}

void loop(){
  inHumidity = analogRead(A2);
  inHumidity = map(inHumidity, 0, 1023, 0, 100);
  inTemperature = dht.readTemperature();

  outHumidity = dht.readHumidity();
  outTemperature = dht.readTemperature();

  // Exibe os dados referentes ao clima INTERNO
  lcd.setCursor(4,0);
  lcd.print(inTemperature);
  lcd.setCursor(8,0);
  lcd.print("C");
  lcd.setCursor(9,0);
  lcd.print("|");
  lcd.setCursor(10,0);
  lcd.print(inHumidity);
  lcd.setCursor(15,0);
  lcd.print("%");
  // console
  Serial.print("Temperatra Interna: ");
  Serial.print(inTemperature);
  Serial.print("| Humidade Interna: ");
  Serial.println(inHumidity);

  // Exibe os dados referentes ao clima EXTERNO
  lcd.setCursor(4,1);
  lcd.print(outTemperature);
  lcd.setCursor(8,1);
  lcd.print("C");
  lcd.setCursor(9,1);
  lcd.print("|");
  lcd.setCursor(10,1);
  lcd.print(outHumidity);
  lcd.setCursor(15,1);
  lcd.print("%");
  // console
  Serial.print("Temperatra Externa: ");
  Serial.print(outTemperature);
  Serial.print("| Humidade Externa: ");
  Serial.println(outHumidity);
  
  delay(1000);
}

