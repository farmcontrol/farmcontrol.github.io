#include <DHT.h>
#include <LiquidCrystal.h>


// Define o pino analogico para ligado do DH21
DHT dht(A1,DHT21);

// Define os pinos que serão utilizados na ligação do LCD
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

float outHumidity = 0, outTemperature = 0; 
float inHumidity = 0, inTemperature = 0;
   
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
  inHumidity = dht.readHumidity();
  inTemperature = dht.readTemperature();

  outHumidity = dht.readHumidity();
  outTemperature = dht.readTemperature();
  
  Serial.print("Temperatra: ");
  Serial.print(outTemperature);
  Serial.print("| Humidade: ");
  Serial.println(outHumidity);

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
  
  delay(10000);
}

