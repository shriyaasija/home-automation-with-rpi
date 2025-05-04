import socket
import RPi.GPIO as GPIO

RELAY_PIN = 17  
LED_PIN = 27    

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(RELAY_PIN, GPIO.OUT)
GPIO.setup(LED_PIN, GPIO.OUT)

# Start with everything off
GPIO.output(RELAY_PIN, GPIO.LOW)  # Fan OFF
GPIO.output(LED_PIN, GPIO.LOW)     # LED OFF

# Socket setup
host = '192.168.37.179'  
port = 1337

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((host, port))
    print("Connected to server")

    while True:
        data = s.recv(1024).decode().strip()
        print(f"Received: {data}")

        if data == "FAN_ON":
            GPIO.output(RELAY_PIN, GPIO.HIGH)  # Fan ON
        elif data == "LIGHT_ON":
            GPIO.output(LED_PIN, GPIO.HIGH)   # LED ON
        elif data == "FAN_OFF":
            GPIO.output(RELAY_PIN, GPIO.LOW)  # Fan OFF
        elif data == "LIGHT_OFF":
            GPIO.output(LED_PIN, GPIO.LOW)    # LED OFF