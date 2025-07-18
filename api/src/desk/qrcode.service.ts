import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QRCodeGenerationService {
  /**
   * Generate a QR code as a data URL for the given data
   * @param data The data to encode in the QR code
   * @returns A Promise that resolves to the QR code as a data URL
   */
  async generateQRCode(data: string): Promise<string> {
    try {
      // Generate QR code as a data URL
      const qrCodeDataUrl = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        margin: 1,
        scale: 8,
      });
      
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }
}
