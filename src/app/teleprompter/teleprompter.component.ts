import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
    import { FormsModule } from '@angular/forms';

    @Component({
      selector: 'app-teleprompter',
      templateUrl: './teleprompter.component.html',
      styleUrls: ['./teleprompter.component.css'],
      standalone: true,
      imports: [FormsModule]
    })
    export class TeleprompterComponent implements OnInit, OnDestroy {
      @ViewChild('teleprompterDisplay') teleprompterDisplay!: ElementRef;

      text = '';
      speed = 10;
      fontFamily = 'Arial';
      fontSize = 32;
      isFlippedHorizontal = false;
      isFlippedVertical = false;
      isPlaying = false;
      scrollInterval: any;
      lastScrollPosition = 0;
      wakeLockSentinel: any = null;

      ngOnInit(): void {
        this.loadSettings();
      }

      ngOnDestroy(): void {
        this.stopScrolling();
        this.releaseWakeLock();
      }

      loadSettings(): void {
        const savedSettings = localStorage.getItem('teleprompterSettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          this.text = settings.text || '';
          this.speed = settings.speed || 10;
          this.fontFamily = settings.fontFamily || 'Arial';
          this.fontSize = settings.fontSize || 32;
          this.isFlippedHorizontal = settings.isFlippedHorizontal || false;
          this.isFlippedVertical = settings.isFlippedVertical || false;
        }
      }

      saveSettings(): void {
        const settings = {
          text: this.text,
          speed: this.speed,
          fontFamily: this.fontFamily,
          fontSize: this.fontSize,
          isFlippedHorizontal: this.isFlippedHorizontal,
          isFlippedVertical: this.isFlippedVertical
        };
        localStorage.setItem('teleprompterSettings', JSON.stringify(settings));
      }

      async requestWakeLock() {
        try {
          this.wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
          this.wakeLockSentinel.addEventListener('release', () => {
            console.log('Screen Wake Lock was released.');
          });
          console.log('Screen Wake Lock is active.');
        } catch (err: any) {
          console.error(`Screen Wake Lock failed: ${err.name}, ${err.message}`);
        }
      }

      releaseWakeLock() {
        if (this.wakeLockSentinel) {
          this.wakeLockSentinel.release();
          this.wakeLockSentinel = null;
          console.log('Screen Wake Lock released.');
        }
      }

      startScrolling(): void {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.requestWakeLock();
        this.scrollInterval = setInterval(() => {
          if (this.teleprompterDisplay) {
            this.lastScrollPosition += this.speed;
            this.teleprompterDisplay.nativeElement.scrollTop = this.lastScrollPosition;
            if (this.teleprompterDisplay.nativeElement.scrollTop + this.teleprompterDisplay.nativeElement.clientHeight >= this.teleprompterDisplay.nativeElement.scrollHeight) {
              this.stopScrolling();
            }
          }
        }, 100);
      }

      stopScrolling(): void {
        this.isPlaying = false;
        clearInterval(this.scrollInterval);
        this.releaseWakeLock();
      }

      resetScrolling(): void {
        this.stopScrolling();
        this.lastScrollPosition = 0;
        if (this.teleprompterDisplay) {
          this.teleprompterDisplay.nativeElement.scrollTop = 0;
        }
      }

      onTextChange(): void {
        this.saveSettings();
      }

      onSpeedChange(event: any): void {
        this.speed = parseInt(event.target.value, 10);
        this.saveSettings();
      }

      onFontChange(event: any): void {
        this.fontFamily = event.target.value;
        this.saveSettings();
      }

      onFontSizeChange(event: any): void {
        this.fontSize = parseInt(event.target.value, 10);
        this.saveSettings();
      }

      toggleFlipHorizontal(): void {
        this.isFlippedHorizontal = !this.isFlippedHorizontal;
        this.saveSettings();
      }

      toggleFlipVertical(): void {
        this.isFlippedVertical = !this.isFlippedVertical;
        this.saveSettings();
      }
    }
