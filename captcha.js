/**
 * Custom 6-Character Alphanumeric CAPTCHA Generator with Noise & Strike Lines
 * Generates an original visual challenge on an HTML5 Canvas.
 */
class CaptchaGenerator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing characters like 0, O, 1, I
    this.currentCaptcha = '';
    this.init();
  }

  init() {
    this.generate();
  }

  /**
   * Random string generator
   */
  generateRandomString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * this.characters.length);
      result += this.characters.charAt(randomIndex);
    }
    return result;
  }

  /**
   * Generates new CAPTCHA text and draws it on the canvas
   */
  generate() {
    this.currentCaptcha = this.generateRandomString(6);
    this.draw();
  }

  /**
   * Renders background, text characters, strike lines, and random noise dots
   */
  draw() {
    const { width, height } = this.canvas;

    // 1. Clear Canvas & Fill Background
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.fillRect(0, 0, width, height);

    // 2. Draw Random Background Noise Dots
    for (let i = 0; i < 45; i++) {
      this.ctx.fillStyle = this.getRandomColor(160, 210);
      this.ctx.beginPath();
      this.ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 2,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    }

    // 3. Draw Strike Lines (Behind & Across Text)
    for (let i = 0; i < 4; i++) {
      this.ctx.strokeStyle = this.getRandomColor(100, 180);
      this.ctx.lineWidth = Math.random() * 1.5 + 1;
      this.ctx.beginPath();
      this.ctx.moveTo(Math.random() * width, Math.random() * height);
      this.ctx.lineTo(Math.random() * width, Math.random() * height);
      this.ctx.stroke();
    }

    // 4. Render 6 Character Text with Random Angles & Colors
    const charWidth = width / 7;
    for (let i = 0; i < this.currentCaptcha.length; i++) {
      const char = this.currentCaptcha.charAt(i);
      const fontSize = Math.floor(Math.random() * 6 + 26); // Size between 26px and 32px
      const angle = (Math.random() - 0.5) * 0.45; // Rotation angle

      this.ctx.save();
      this.ctx.font = `600 ${fontSize}px 'Plus Jakarta Sans', monospace`;
      this.ctx.fillStyle = this.getRandomColor(20, 90); // Darker text for readability

      // Position characters across the width
      const x = (i + 1) * charWidth - 10;
      const y = height / 2 + fontSize / 3 - 3;

      this.ctx.translate(x, y);
      this.ctx.rotate(angle);
      this.ctx.fillText(char, 0, 0);
      this.ctx.restore();
    }

    // 5. Draw Foreground Overlay Noise Lines
    for (let i = 0; i < 2; i++) {
      this.ctx.strokeStyle = this.getRandomColor(80, 150);
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.moveTo(0, Math.random() * height);
      this.ctx.bezierCurveTo(
        width / 3, Math.random() * height,
        (width / 3) * 2, Math.random() * height,
        width, Math.random() * height
      );
      this.ctx.stroke();
    }
  }

  /**
   * Returns a randomized RGB color string within given brightness range
   */
  getRandomColor(min, max) {
    const r = Math.floor(Math.random() * (max - min + 1)) + min;
    const g = Math.floor(Math.random() * (max - min + 1)) + min;
    const b = Math.floor(Math.random() * (max - min + 1)) + min;
    return `rgb(${r},${g},${b})`;
  }

  /**
   * Validates user input against the generated CAPTCHA (case-insensitive)
   */
  validate(input) {
    return input.trim().toUpperCase() === this.currentCaptcha.toUpperCase();
  }
}
