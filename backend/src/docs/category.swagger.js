/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Kategori yönetimi
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Tüm kategorileri getir
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Kategoriler listelendi
 *
 *   post:
 *     summary: Yeni kategori oluştur (Sadece admin)
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kategori başarıyla oluşturuldu
 *       400:
 *         description: Hatalı istek
 *       401:
 *         description: Yetkisiz
 */
