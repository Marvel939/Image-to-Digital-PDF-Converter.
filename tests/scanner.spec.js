import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

test('import, enhance, crop, rotate, reorder, remove and export document', async ({page})=>{
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.getByRole('button',{name:/Download PDF/})).toBeDisabled();
 const data=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=600;c.height=800;const x=c.getContext('2d');x.fillStyle='#e0d7bd';x.fillRect(0,0,600,800);x.fillStyle='#fff';x.fillRect(35,35,530,730);x.fillStyle='#222';x.font='30px sans-serif';x.fillText('DOCUMENT TEST',70,100);x.font='20px sans-serif';x.fillText('An example invoice',70,150);return c.toDataURL('image/png').split(',')[1];});
 const image={name:'invoice.png',mimeType:'image/png',buffer:Buffer.from(data,'base64')};
 await page.locator('#files').setInputFiles([image,image]);
 await expect(page.locator('#count')).toHaveText('2');
 await expect(page.locator('#canvas')).toBeVisible();
 await page.getByRole('button',{name:'Grayscale',exact:true}).click();
 await page.locator('#contrast').fill('40');
 await page.getByRole('button',{name:/Rotate/}).click();
 await expect(page.locator('#dimensions')).toHaveText('800 × 600 PX');
 await page.getByRole('button',{name:/Apply crop/}).click();
 await expect(page.getByRole('status')).toContainText('Perspective straightened');
 await page.getByRole('button',{name:'Reset page'}).click();
 await expect(page.locator('#dimensions')).toHaveText('600 × 800 PX');
 await page.locator('.page-card').first().dragTo(page.locator('.page-card').last());
 await page.locator('#filename').fill('Scanned invoice');
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:/Download PDF/}).click();
 const download=await downloadPromise;
 expect(download.suggestedFilename()).toBe('Scanned invoice.pdf');
 const bytes=await fs.readFile(await download.path());
 expect(bytes.subarray(0,5).toString()).toBe('%PDF-');
 expect(bytes.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(2);
 await page.getByRole('button',{name:'Remove page 1',exact:true}).click();
 await expect(page.locator('#count')).toHaveText('1');
 await page.getByRole('button',{name:'Remove page 1',exact:true}).click();
 await expect(page.locator('#empty')).toBeVisible();
 expect(errors).toEqual([]);
});

test('mobile layout and invalid file handling',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await expect(page.getByRole('button',{name:/Take a photo/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('#files').setInputFiles({name:'bad.png',mimeType:'image/png',buffer:Buffer.from('broken')});
 await expect(page.getByRole('status')).toContainText('Could not open');
 await expect(page.locator('#count')).toHaveText('0');
});
