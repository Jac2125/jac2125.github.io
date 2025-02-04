---
layout: page
title: Getting Started with
description: with background image
importance: 1
category: Embedded
related_publications: true
---

Just got started with _STM32F103C6T6A_. I was about to purchase _STM32F103C8T6_ but I have received the previous one instead. Game is game, can't always complain. So I'll start using it with STM32 Cube IDE.

This page will show some demo code turning on PC13 LED along implementation of GPIO pin.

Here is the chip configuration

<div class = "row justify-content-sm-center">
    <div class = "col-sm">
        {% include figure.liquid path = "assets/img/PC13 GPIO Pin Chip Config.png" title = "Chip Configuration" class "img-fluid rounded z-depth-1" %}
    </div>
</div>

The code will be generated when the config is saved.

```
#include "main.h"

void SystemClock_Config(void);
static void MX_GPIO_Init(void);

int main(void)
{

  /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
  HAL_Init();
  
  /* Configure the system clock */
  SystemClock_Config();

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  
  /* Infinite loop */
  /* USER CODE BEGIN WHILE */
  while (1)
  {
    /* USER CODE END WHILE */
	HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13,1);
	HAL_Delay(250);
	HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13,0);
	HAL_Delay(250);
  }
}

```

The function `HAL_GPIO_writePIn` would turn on GPIO 13 when the third arg is 1. Otherwise, when it is 0, the pin will be set to low.