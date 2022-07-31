import serial.tools.list_ports

from Pedal import Pedal


def main(port):
    p = Pedal()
    for key in p.run(port):
        print(key, p.func_1)


if __name__ == '__main__':
    for p in list(serial.tools.list_ports.comports()):
        print(p.device)
        if p.pid == 5 and p.vid == 11914:
            main(p.device)
