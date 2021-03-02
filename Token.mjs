import crypto from 'crypto';

class Token {
  constructor(str) {
    if (!str) throw new Error('str is required.');
    if (str.split('.').length === 3) {
      let token = str.split('.');
      this.id = Buffer.from(token[0], 'base64').toString('utf8');
      this.time = Buffer.from(token[1], 'base64').toString('utf8');
      this.bytes = Buffer.from(token[2], 'base64');
    } else {
      this.id = str;
      this.time = Date.now().toString();
      this.time = this.time.substr(this.time.length - 3, this.time.length);
      this.bytes = crypto.randomBytes(24);
    }
  }

  toString() {
    return `${Buffer.from(this.id)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')}.${Buffer.from(this.time).toString(
      'base64'
    )}.${this.bytes
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')}`;
  }
}

export default Token;
