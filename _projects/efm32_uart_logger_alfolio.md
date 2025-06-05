---
layout: page
title: EFM32GG990 HC SR04 with TTY on VBox
description: with background image
importance: 2
category: Embedded
related_publications: true
---

# 📟 EFM32 + UART Serial Logger Project Summary

## 🧠 Project Objective

To interface an EFM32GG microcontroller with a Linux system running on VirtualBox via UART,  
capture specific data streams sent over serial, and log them into a text file under defined conditions.

---

## 🔧 Development Environment

| Component      | Details                                    |
|----------------|--------------------------------------------|
| MCU            | EFM32GG990F1024 (Giant Gecko)              |
| Host OS        | Windows                                    |
| Guest OS       | Ubuntu (VirtualBox)                        |
| Serial Device  | USB to UART (CP210x or J-Link CDC)         |
| Device Path    | `/dev/ttyS2`, `/dev/ttyUSB0`               |
| Terminal Tools | `cat`, `minicom`, custom C logger          |

---

## 💬 Problem-Solving Process

### 📌 What’s the difference between USART and UART?
- USART supports both asynchronous (UART) and synchronous (SPI-like) communication.
- UART supports asynchronous communication only; simpler hardware.

### 📌 Why does sharing a clock signal make communication synchronous?
- A shared clock provides a precise timing reference.
- Receiver samples data based on clock edges → high accuracy.

### 📌 What is oversampling in UART?
- Receiver samples each bit multiple times (commonly 16x).
- Helps correct timing drift and reduce noise-induced errors.

### 📌 How to connect COM ports in VirtualBox?
- Enable serial port → select "Host Device" → enter `\.\COM3`.
- Or use USB filter to pass-through CP210x device to guest → becomes `/dev/ttyUSB0`.

### 📌 Why wasn't data being saved to file?
- Buffered file I/O requires flushing.
- Solution: disable buffering with `setvbuf()` or call `fflush()` explicitly.

---

## ✅ Final C Code (`serial_logger.c`)

```c
#include <stdio.h>
#include <fcntl.h>
#include <termios.h>
#include <unistd.h>
#include <string.h>
#include <time.h>

int main() {
    int fd = open("/dev/ttyS2", O_RDONLY | O_NOCTTY);
    if (fd < 0) {
        perror("open");
        return 1;
    }

    struct termios tty;
    tcgetattr(fd, &tty);
    cfsetospeed(&tty, B115200);
    cfsetispeed(&tty, B115200);
    tty.c_cflag |= (CLOCAL | CREAD);
    tcsetattr(fd, TCSANOW, &tty);

    FILE *output = fopen("serial_capture.txt", "a");
    setvbuf(output, NULL, _IONBF, 0);  // Unbuffered mode
    if (!output) {
        perror("fopen");
        return 1;
    }

    char line[256];
    int capture = 0;
    int counter = 5 * 60;  // 5 minutes loop

    while (counter) {
        int n = read(fd, line, sizeof(line) - 1);
        if (n <= 0) continue;

        line[n] = '\0';

        if (strstr(line, "###START###")) {
            capture = 10;
            continue;
        }

        if (capture > 0) {
            fputs(line, output);
            fflush(output);
            capture--;
            if (capture == 0) {
                printf("Captured 10 lines.\n");
            }
        }

        counter--;
    }

    fclose(output);
    close(fd);
    return 0;
}
```

---

## 💡 Key Learnings

| Topic                        | Takeaway                                                                 |
|-----------------------------|--------------------------------------------------------------------------|
| UART vs USART               | USART includes UART plus synchronous support (e.g., SPI-like).           |
| Oversampling                | Improves bit detection accuracy in UART reception.                      |
| VirtualBox Serial Setup     | Use host COM port or USB pass-through for `/dev/ttyUSBx`.               |
| File Buffering              | Prevent data loss using `fflush()` or disabling I/O buffering.          |
| Conditional Logging Trigger | Using `"###START###"` as a UART-based capture signal.                   |

---

## 📌 Future Improvements

- Port logger to FreeRTOS Task with queue/message support
- Add timestamp and JSON formatting to logs
- Trigger logging based on sensor values (e.g. HC-SR04 distance)
- Write logs directly to SD card or flash via USB CDC

---
