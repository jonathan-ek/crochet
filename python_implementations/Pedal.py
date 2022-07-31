import json
import serial


class Pedal:
    RIGHT = 'right'
    LEFT = 'left'
    FUNC_1 = 'func_1'
    FUNC_2 = 'func_2'
    FUNC_3 = 'func_3'

    def __init__(self):
        self.func_1 = 0
        self.func_2 = 0
        self.func_3 = 0
        self.right = 0
        self.left = 0

    def run(self, port):
        prev_res = [0, 0, 0, 0, 0]
        while True:
            ser = serial.Serial(
                port=port,
                baudrate=115200,
                parity=serial.PARITY_NONE,
                stopbits=serial.STOPBITS_ONE,
                bytesize=serial.EIGHTBITS,
            )
            res = json.loads(ser.readline().decode().strip())

            right_up, middle_up, left_up, left_down, right_down = res
            p_right_up, p_middle_up, p_left_up, p_left_down, p_right_down = prev_res
            if left_down != p_left_down:
                if left_down:
                    self.left = 1
                    yield self.LEFT
                else:
                    self.left = 0
            if right_down != p_right_down:
                if right_down:
                    self.right = 1
                    yield self.RIGHT
                else:
                    self.right = 0
            if left_up != p_left_up:
                if left_up:
                    self.func_1 = 1
                    yield self.FUNC_1
                else:
                    self.func_1 = 0
            if middle_up != p_middle_up:
                if middle_up:
                    self.func_2 = 1
                    yield self.FUNC_2
                else:
                    self.func_2 = 0
            if right_up != p_right_up:
                if right_up:
                    self.func_3 = 1
                    yield self.FUNC_3
                else:
                    self.func_3 = 0
            prev_res = res
