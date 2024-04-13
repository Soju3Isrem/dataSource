#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <Adafruit_Sensor.h>
#include "DHT.h"

#define dhttype DHT22
#define dhtpin 18
DHT dht(dhtpin, dhttype);

unsigned long timeUpdata = 0;

const char *ssid = "";
const char *password = "";

String serverName = "http://";


unsigned long lastTime = 0;
unsigned long timerDelay = 8000;

String token = "";
bool auth = false;

String putData(String path, String humedad, String temperatura, String idSensor);


void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

}

void loop() {




  if ((millis() - lastTime) > timerDelay)
  {
    
    // Check WiFi connection status
    if (WiFi.status() == WL_CONNECTED)
    {

      float h = dht.readHumidity();
      float t = dht.readTemperature();

      if(h>0 and t >0){
        char temperatura[10];
        dtostrf(t, 6, 2, temperatura);
        char humedad[10];
        dtostrf(h, 6, 2, humedad);      
        String msg = putData(serverName+"/sensor", humedad, temperatura, "1");
        
        Serial.println(msg);

        JSONVar myObject = JSON.parse(msg);
        JSONVar keys = myObject.keys();
        JSONVar value = myObject[keys[0]];
        
      }


      
    }
    else
    {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }  

}



String putData(String path, String humedad, String temperatura, String idSensor){

  HTTPClient http;
  http.begin(path.c_str());
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");  
  http.addHeader("id", idSensor);
  http.addHeader("humedad", humedad);
  http.addHeader("temperatura", temperatura);    
  http.addHeader("longitud", "-90.37083"); 
  http.addHeader("latitud", "15.47083"); 

  int httpResponseCode = http.POST("");


    if (httpResponseCode > 0){
        String payload = http.getString();
        http.end();
        return payload;

      }
      else
      {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      http.end();  

}









