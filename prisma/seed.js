'use strict';

/**
 * VitalTrail DB Seed — 15 usuarios + 30 rutas + 3 imágenes/ruta
 * Ejecutar: DATABASE_URL="postgresql://montes:FMDs1mdv@localhost:5432/vitaltrail_db" node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const prisma = new PrismaClient();

// $2y$12$ — bcrypt de 'FMDs1mdv', compatible con PHP/Symfony
const PASSWORD_HASH = '$2y$12$5B/5N4vOmrPMWc87vFl5vuiztCufKJmla9PfVwATgfWnzyJISgIt.';
const IMAGE_DIR = '/home/paco/Proyectos/VitalTrail/imageserver/images/routes';

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateSlug(title) {
    const base = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 64);
    const hash = crypto.randomBytes(4).toString('hex');
    return `${base}-${hash}`;
}

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const makeRequest = (requestUrl, redirects = 0) => {
            if (redirects > 5) { reject(new Error('Too many redirects')); return; }
            const client = requestUrl.startsWith('https') ? https : http;
            const req = client.get(requestUrl, { timeout: 15000 }, (response) => {
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    const location = response.headers.location.startsWith('http')
                        ? response.headers.location
                        : new URL(response.headers.location, requestUrl).toString();
                    makeRequest(location, redirects + 1);
                    return;
                }
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode} for ${url}`));
                    return;
                }
                const file = fs.createWriteStream(dest);
                response.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
                file.on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
            });
            req.on('error', reject);
            req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
        };
        makeRequest(url);
    });
}

async function downloadWithRetry(url, dest, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await downloadImage(url, dest);
            return true;
        } catch (err) {
            if (i === retries - 1) {
                console.warn(`  ⚠  Failed to download (skipping): ${path.basename(dest)} — ${err.message}`);
                return false;
            }
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
}

// ─── Data ────────────────────────────────────────────────────────────────────

const USERS = [
    { username: 'carlos_garcia',     email: 'carlos.garcia@vitaltrail.es',     name: 'Carlos',    surname: 'García Rodríguez',   birthday: '1988-04-12', bio: 'Apasionado del senderismo y la montaña. Cada ruta es una nueva aventura.',             imgUser: 'avatar-default-m1.png' },
    { username: 'maria_lopez',       email: 'maria.lopez@vitaltrail.es',       name: 'María',     surname: 'López Fernández',    birthday: '1993-07-28', bio: 'Busco la calma en cada sendero. La naturaleza es mi mejor terapia.',                   imgUser: 'avatar-default-f2.png' },
    { username: 'alejandro_m',       email: 'alejandro.martinez@vitaltrail.es',name: 'Alejandro', surname: 'Martínez Santos',    birthday: '1985-01-15', bio: 'Trail runner y montañero. Subo todo lo que se ponga por delante.',                      imgUser: 'avatar-default-m3.png' },
    { username: 'lucia_sanchez',     email: 'lucia.sanchez@vitaltrail.es',     name: 'Lucía',     surname: 'Sánchez Jiménez',    birthday: '1996-09-03', bio: 'Amante de los paisajes de interior. El monte es mi segunda casa.',                    imgUser: 'avatar-default-f4.png' },
    { username: 'pablo_hernandez',   email: 'pablo.hernandez@vitaltrail.es',   name: 'Pablo',     surname: 'Hernández Pérez',    birthday: '1991-11-22', bio: 'Descubro rincones de España que la mayoría desconoce. Comparto todo lo que encuentro.', imgUser: 'avatar-default-m5.png' },
    { username: 'ana_gonzalez',      email: 'ana.gonzalez@vitaltrail.es',      name: 'Ana',       surname: 'González Moreno',    birthday: '1989-03-17', bio: 'Senderista desde los 12 años. Prefiero las rutas tranquilas con buenas vistas.',       imgUser: 'avatar-default-f6.png' },
    { username: 'javier_dom',        email: 'javier.dominguez@vitaltrail.es',  name: 'Javier',    surname: 'Domínguez Ruiz',     birthday: '1984-06-08', bio: 'Fan del nordic walking y los senderos de recuperación. Cuido mucho las rodillas.',     imgUser: 'avatar-default-m7.png' },
    { username: 'elena_torres',      email: 'elena.torres@vitaltrail.es',      name: 'Elena',     surname: 'Torres Alonso',      birthday: '1994-12-30', bio: 'Fotógrafa de naturaleza. Las rutas son mi excusa para capturar el mundo.',            imgUser: 'avatar-default-f8.png' },
    { username: 'diego_ramirez',     email: 'diego.ramirez@vitaltrail.es',     name: 'Diego',     surname: 'Ramírez López',      birthday: '1987-08-14', bio: 'Guía de montaña certificado. Experto en Sierra Nevada y los Pirineos.',               imgUser: 'avatar-default-m9.png' },
    { username: 'carmen_flores',     email: 'carmen.flores@vitaltrail.es',     name: 'Carmen',    surname: 'Flores Romero',      birthday: '1990-02-25', bio: 'Me encanta organizar salidas grupales. La montaña une a la gente.',                   imgUser: 'avatar-default-f1.png' },
    { username: 'andres_molina',     email: 'andres.molina@vitaltrail.es',     name: 'Andrés',    surname: 'Molina Castro',      birthday: '1982-10-07', bio: 'Veteran del Camino de Santiago (3 veces). Creo en el poder del caminar.',            imgUser: 'avatar-default-m2.png' },
    { username: 'isabel_gut',        email: 'isabel.gutierrez@vitaltrail.es',  name: 'Isabel',    surname: 'Gutiérrez Díaz',     birthday: '1997-05-19', bio: 'Universitaria apasionada del outdoor. Rutas fáciles con vistas increíbles.',         imgUser: 'avatar-default-f3.png' },
    { username: 'ruben_serrano',     email: 'ruben.serrano@vitaltrail.es',     name: 'Rubén',     surname: 'Serrano Vargas',     birthday: '1986-07-04', bio: 'Maratoniano reconvertido al trail. Ahora corro pero sin cronómetro.',               imgUser: 'avatar-default-m4.png' },
    { username: 'sofia_medina',      email: 'sofia.medina@vitaltrail.es',      name: 'Sofía',     surname: 'Medina Herrera',     birthday: '1995-01-11', bio: 'Yoga en plena naturaleza y senderismo mindful. Conexión total con el entorno.',      imgUser: 'avatar-default-f5.png' },
    { username: 'nicolas_ortega',    email: 'nicolas.ortega@vitaltrail.es',    name: 'Nicolás',   surname: 'Ortega Blanco',      birthday: '1992-09-29', bio: 'Explorador urbano y rural. Documenta cada ruta con GPS y relato detallado.',        imgUser: 'avatar-default-m6.png' },
];

// idCategory: 1=explora 2=desconecta 3=actívate 4=recupera 5=consolida 6=socializa
const ROUTES = [
    // ── Categoría 1: Explora ─────────────────────────────────────────────────
    {
        title: 'Camino del Rey',
        description: 'El Camino del Rey es una de las rutas más espectaculares y conocidas de España. Este sendero suspendido sobre la Garganta del Chorro (Ardales, Málaga) discurre por pasarelas de madera ancladas en la roca vertical de un impresionante desfiladero. La ruta completa incluye el tramo histórico y el nuevo, con vistas al embalse del Conde del Guadalhorce. Se recomienda reserva previa y casco obligatorio. Una experiencia única que combina vértigo, historia y paisaje malagueño.',
        distance: 8200, duration: 180, difficulty: 'experto', typeRoute: 'solo ida',
        location: 'Ardales, Málaga', idCategory: 1,
        coordinates: [
            { lat: 36.9120, lng: -4.8234 }, { lat: 36.9187, lng: -4.8123 },
            { lat: 36.9254, lng: -4.8012 }, { lat: 36.9321, lng: -4.7901 },
            { lat: 36.9388, lng: -4.7790 }, { lat: 36.9455, lng: -4.7679 },
        ],
    },
    {
        title: 'Senda de los Pescadores del Sella',
        description: 'La Senda de los Pescadores sigue el curso del río Sella desde Arriondas hasta Ribadesella a lo largo de la comarca del Oriente de Asturias. Este precioso camino fluvial, usado históricamente por pescadores de salmón, atraviesa frondosos bosques de ribera, puentes de piedra y aldeas asturianas encantadoras. El trazado es cómodo y apenas tiene desnivel, ideal para quienes buscan descubrir la Asturias más auténtica a su ritmo. En primavera florece un manto de flores silvestres que lo convierte en un paraíso.',
        distance: 12400, duration: 210, difficulty: 'moderada', typeRoute: 'solo ida',
        location: 'Arriondas, Asturias', idCategory: 1,
        coordinates: [
            { lat: 43.3892, lng: -5.1872 }, { lat: 43.3945, lng: -5.1743 },
            { lat: 43.3998, lng: -5.1614 }, { lat: 43.4052, lng: -5.1485 },
            { lat: 43.4105, lng: -5.1356 }, { lat: 43.4158, lng: -5.1227 },
        ],
    },
    {
        title: 'Ruta del Sequoion de La Granja',
        description: 'En el corazón del Real Sitio de La Granja de San Ildefonso, en las laderas de la Sierra de Guadarrama, crece un ejemplar de Sequoia gigantea de más de 50 metros de altura que es el árbol más alto de España. Esta ruta circular por los jardines históricos y el bosque contiguo combina la visita al gigante vegetal con un paseo por arboledas de castaños, robles y pinos. Una caminata tranquila, sin grandes desniveles, perfecta para familias y para quien quiera disfrutar del ambiente otoñal segoviano.',
        distance: 6100, duration: 90, difficulty: 'fácil', typeRoute: 'circular',
        location: 'La Granja de San Ildefonso, Segovia', idCategory: 1,
        coordinates: [
            { lat: 40.9276, lng: -4.0143 }, { lat: 40.9312, lng: -4.0098 },
            { lat: 40.9347, lng: -4.0053 }, { lat: 40.9383, lng: -4.0098 },
            { lat: 40.9347, lng: -4.0143 }, { lat: 40.9276, lng: -4.0143 },
        ],
    },
    {
        title: 'Vía Verde de la Sierra',
        description: 'La Vía Verde de la Sierra recorre el antiguo trazado del ferrocarril que nunca llegó a terminarse entre Olvera (Cádiz) y Puerto Serrano, atravesando la Sierra de Cádiz por túneles iluminados, viaductos de hierro y estaciones recuperadas. Con una longitud de 36 km, es posible hacer etapas parciales. El paisaje alterna olivares centenarios, encinas, dehesas y pueblos blancos andaluces de postal. La ausencia de pendientes y el firme adecuado la convierten en una ruta accesible para todo tipo de usuarios.',
        distance: 22800, duration: 300, difficulty: 'fácil', typeRoute: 'solo ida',
        location: 'Olvera, Cádiz', idCategory: 1,
        coordinates: [
            { lat: 36.9427, lng: -5.2744 }, { lat: 36.9519, lng: -5.2532 },
            { lat: 36.9611, lng: -5.2321 }, { lat: 36.9703, lng: -5.2110 },
            { lat: 36.9795, lng: -5.1899 }, { lat: 36.9887, lng: -5.1688 },
        ],
    },
    {
        title: 'Ruta del Cares — Garganta Divina',
        description: 'La Ruta del Cares es la gran joya del Parque Nacional de los Picos de Europa y una de las excursiones más famosas de España. El sendero discurre durante 12 km por una canal excavada en la roca viva junto al río Cares, a veces a más de 1000 metros sobre el nivel del río, con el macizo Ándara al fondo. Imprescindible hacerla en dos etapas o subir un vehículo al punto de llegada. La vista desde los miradores es absolutamente sobrecogedora. Una ruta que mezcla ingeniería histórica y naturaleza salvaje.',
        distance: 22300, duration: 360, difficulty: 'moderada', typeRoute: 'solo ida',
        location: 'Poncebos, Asturias', idCategory: 1,
        coordinates: [
            { lat: 43.2617, lng: -4.9123 }, { lat: 43.2738, lng: -4.8956 },
            { lat: 43.2859, lng: -4.8789 }, { lat: 43.2980, lng: -4.8622 },
            { lat: 43.3101, lng: -4.8455 }, { lat: 43.3222, lng: -4.8288 },
        ],
    },

    // ── Categoría 2: Desconecta ──────────────────────────────────────────────
    {
        title: 'Laguna Negra de Soria',
        description: 'La Laguna Negra es un lago glaciar de aguas oscuras y profundas ubicado en plena Sierra de Urbión, en el municipio de Vinuesa (Soria). El acceso se realiza a pie desde el aparcamiento habilitado, siguiendo un camino entre pinares que desemboca en una ribera de cuento: paredes rocosas verticales cubiertas de musgo, el agua inmóvil y el silencio absoluto. Machado dedicó versos a este rincón soriano. En otoño, los reflejos de los pinos en el agua la convierten en una de las estampas más bellas de Castilla.',
        distance: 4200, duration: 75, difficulty: 'fácil', typeRoute: 'circular',
        location: 'Vinuesa, Soria', idCategory: 2,
        coordinates: [
            { lat: 41.9878, lng: -2.7453 }, { lat: 41.9912, lng: -2.7398 },
            { lat: 41.9946, lng: -2.7343 }, { lat: 41.9980, lng: -2.7398 },
            { lat: 41.9946, lng: -2.7453 }, { lat: 41.9878, lng: -2.7453 },
        ],
    },
    {
        title: 'Senda del Oso por el Valle del Trubia',
        description: 'La Senda del Oso recorre el antiguo trazado del ferrocarril minero del valle del Trubia (Asturias) entre Entrago y Villamanín, pasando por los bosques de la Reserva de Caza de Muniellos. El nombre alude a los osos pardos que habitan los montes colindantes. La senda discurre junto al río por un bosque atlántico de ribera exuberante, con puentes colgantes y algunos tramos espectaculares. La ausencia de tráfico motorizado y el perfil plano la convierten en una ruta perfecta para desconectar a cualquier ritmo.',
        distance: 30500, duration: 360, difficulty: 'fácil', typeRoute: 'solo ida',
        location: 'Proaza, Asturias', idCategory: 2,
        coordinates: [
            { lat: 43.2340, lng: -6.1542 }, { lat: 43.2456, lng: -6.1346 },
            { lat: 43.2572, lng: -6.1150 }, { lat: 43.2688, lng: -6.0954 },
            { lat: 43.2804, lng: -6.0758 }, { lat: 43.2920, lng: -6.0562 },
        ],
    },
    {
        title: 'Nacimiento del Río Borosa',
        description: 'El Nacimiento del Río Borosa es la excursión estrella del Parque Natural de Cazorla, Segura y las Villas (Jaén). El sendero remonta el río entre paredes de caliza blanca, cruza pasarelas de madera sobre pozas turquesa y atraviesa dos túneles excavados en la roca antes de alcanzar el nacimiento. La biodiversidad es extraordinaria: nutrias, ciervos, buitres leonados y una flora mediterránea de ensueño. El regreso por el mismo camino permite contemplar los paisajes con la luz cambiada. Una ruta imprescindible en Andalucía.',
        distance: 17800, duration: 300, difficulty: 'moderada', typeRoute: 'solo ida',
        location: 'Cazorla, Jaén', idCategory: 2,
        coordinates: [
            { lat: 37.8234, lng: -2.8651 }, { lat: 37.8312, lng: -2.8498 },
            { lat: 37.8390, lng: -2.8345 }, { lat: 37.8468, lng: -2.8192 },
            { lat: 37.8546, lng: -2.8039 }, { lat: 37.8624, lng: -2.7886 },
        ],
    },
    {
        title: 'Bosque de Irati y Selva de Aezkoa',
        description: 'El bosque de Irati, en el Pirineo navarro, es uno de los hayedos-abetales más extensos y mejor conservados de Europa. Esta ruta circular parte desde Ochagavía y penetra en el corazón de la selva, donde la luz apenas atraviesa el dosel forestal. En otoño, la explosión cromática de rojos, amarillos y naranjas es de película. La ruta rodea el embalse de Irabia y atraviesa pequeños refugios forestales. Una experiencia inmersiva en una naturaleza que recuerda a los cuentos de los hermanos Grimm.',
        distance: 12100, duration: 180, difficulty: 'moderada', typeRoute: 'circular',
        location: 'Ochagavía, Navarra', idCategory: 2,
        coordinates: [
            { lat: 42.8921, lng: -1.2143 }, { lat: 42.8976, lng: -1.2076 },
            { lat: 42.9031, lng: -1.2009 }, { lat: 42.9086, lng: -1.2076 },
            { lat: 42.9031, lng: -1.2143 }, { lat: 42.8921, lng: -1.2143 },
        ],
    },
    {
        title: 'Paseo por el Parque Natural de Gorbeia',
        description: 'El Parque Natural de Gorbeia, en pleno País Vasco, alberga las mayores extensiones de hayedo atlántico de Euskadi. Esta ruta circular de dificultad media explora las laderas sur del macizo, pasando por la famosa Cruz de Gorbeia (1482 m), emblema del pueblo vasco. La vista desde la cima abarca el Cantábrico, los Pirineos y la meseta castellana en un mismo panorama. Las praderas verdes salpicadas de caseríos tradicionales y el rugido de los txantxiku (cuervos) completan una experiencia profundamente vasca.',
        distance: 14300, duration: 240, difficulty: 'moderada', typeRoute: 'circular',
        location: 'Zeanuri, Bizkaia', idCategory: 2,
        coordinates: [
            { lat: 43.0234, lng: -2.6789 }, { lat: 43.0312, lng: -2.6667 },
            { lat: 43.0390, lng: -2.6545 }, { lat: 43.0468, lng: -2.6667 },
            { lat: 43.0390, lng: -2.6789 }, { lat: 43.0234, lng: -2.6789 },
        ],
    },

    // ── Categoría 3: Actívate ────────────────────────────────────────────────
    {
        title: 'Ascensión al Mulhacén desde Capileira',
        description: 'El Mulhacén (3479 m) es el techo de la Península Ibérica y conquistarlo desde la Alpujarra granadina es un reto mayor que no está al alcance de todos. La ruta asciende desde Capileira por el barranco del Mulhacén, superando desniveles de más de 2000 m en terreno de alta montaña. Hay que ir preparado con ropa de abrigo, agua y comida para todo el día. La cima ofrece, en días claros, vistas hasta el Rif marroquí al sur y los Pirineos al norte. Una experiencia alpina en plena Andalucía.',
        distance: 26300, duration: 480, difficulty: 'experto', typeRoute: 'circular',
        location: 'Capileira, Granada', idCategory: 3,
        coordinates: [
            { lat: 36.9567, lng: -3.4789 }, { lat: 36.9712, lng: -3.4634 },
            { lat: 36.9857, lng: -3.4479 }, { lat: 37.0002, lng: -3.4324 },
            { lat: 37.0147, lng: -3.4169 }, { lat: 37.0292, lng: -3.4014 },
        ],
    },
    {
        title: 'Travesía de Montserrat — Camí de les Agulles',
        description: 'Montserrat (1236 m) es el macizo más emblemático de Cataluña, visible desde casi toda la región. Este recorrido por el Camí de les Agulles conecta las agujas y pináculos más espectaculares del macizo con vistas al Llobregat y a los Pirineos. La ruta técnicamente exige agilidad en algunos tramos de escalada fácil (nivel I-II), pero el esfuerzo se ve recompensado por una sucesión de paisajes únicos. El aroma a romero y tomillo impregna cada kilómetro de este sendero icónico del excursionismo catalán.',
        distance: 15800, duration: 300, difficulty: 'difícil', typeRoute: 'circular',
        location: 'Monistrol de Montserrat, Barcelona', idCategory: 3,
        coordinates: [
            { lat: 41.5936, lng: 1.8380 }, { lat: 41.6012, lng: 1.8456 },
            { lat: 41.6088, lng: 1.8532 }, { lat: 41.6164, lng: 1.8608 },
            { lat: 41.6088, lng: 1.8684 }, { lat: 41.5936, lng: 1.8380 },
        ],
    },
    {
        title: 'Subida al Pico Veleta por el Camino del Llano',
        description: 'El Pico Veleta (3394 m) es el segundo coloso de la Península y se puede ascender a pie desde el Albergue Universitario de Sierra Nevada. La ruta sigue en parte la antigua carretera de Sierra Nevada hasta el collado, y luego attaca la arista NW en terreno de roca y nieve (según la época). Las vistas desde la cima hacia el Mulhacén, el Corredor del Veleta y la costa granadina son de otro mundo. Se recomienda hacerla de julio a septiembre y llevar equipo de montaña completo.',
        distance: 17600, duration: 360, difficulty: 'experto', typeRoute: 'solo ida',
        location: 'Sierra Nevada, Granada', idCategory: 3,
        coordinates: [
            { lat: 37.1234, lng: -3.3856 }, { lat: 37.1312, lng: -3.3734 },
            { lat: 37.1390, lng: -3.3612 }, { lat: 37.1468, lng: -3.3490 },
            { lat: 37.1546, lng: -3.3368 }, { lat: 37.1624, lng: -3.3246 },
        ],
    },
    {
        title: 'Pico Almanzor desde el Refugio del Rey',
        description: 'El Almanzor (2592 m) es el techo del Sistema Central y domina toda la Sierra de Gredos desde Ávila. La aproximación desde el Refugio del Rey atraviesa el impresionante circo glaciar de la Plataforma, con sus pozas de agua cristalina y el lagarto ocelado como compañero de ruta. El tramo final a la cima exige algo de manos, pero no es escalada técnica. Las vistas desde la cumbre abarcan desde el Guadarrama hasta Salamanca. Una ruta clásica del montañismo castellano-leonés.',
        distance: 20100, duration: 420, difficulty: 'difícil', typeRoute: 'circular',
        location: 'Hoyos del Espino, Ávila', idCategory: 3,
        coordinates: [
            { lat: 40.2567, lng: -5.3021 }, { lat: 40.2656, lng: -5.2898 },
            { lat: 40.2745, lng: -5.2775 }, { lat: 40.2834, lng: -5.2652 },
            { lat: 40.2745, lng: -5.2529 }, { lat: 40.2567, lng: -5.3021 },
        ],
    },
    {
        title: 'Travesía del Puigmal desde el Valle de Núria',
        description: 'El Puigmal (2913 m) es el punto más alto de la Cordillera Pirenaica Transversal y se alcanza cómodamente desde el santuario de Núria en el Ripollès. La ruta sube por la cresta sureste, alternando praderas alpinas y campos de pedrera, con vistas al Canigó, el Cadí y las llanuras del Empordà. El descenso puede hacerse por la vertiente norte hacia la Molina, creando una travesía de alta montaña que conecta dos valles pirenaicos con carácter propio. Imprescindible llevar mapa y brújula.',
        distance: 21600, duration: 420, difficulty: 'difícil', typeRoute: 'solo ida',
        location: 'Núria, Girona', idCategory: 3,
        coordinates: [
            { lat: 42.3912, lng: 2.1543 }, { lat: 42.3987, lng: 2.1678 },
            { lat: 42.4062, lng: 2.1813 }, { lat: 42.4137, lng: 2.1948 },
            { lat: 42.4212, lng: 2.2083 }, { lat: 42.4287, lng: 2.2218 },
        ],
    },

    // ── Categoría 4: Recupera ────────────────────────────────────────────────
    {
        title: 'Ruta del Algarrobo por la Marina Baixa',
        description: 'Esta sencilla ruta circular por las laderas de la Marina Baixa (Alicante) recorre campos de algarrobos, almendros y olivos con vistas al Mediterráneo y al Puig Campana al fondo. El camino transcurre por senderos de tierra compacta y antiguas veredas rurales, sin apenas desnivel, ideal como primera salida para quien está recuperándose de una lesión o simplemente necesita moverse sin exigencia. El olor a tomillo y romero mediterráneo es terapéutico. Un paseo que hace bien al cuerpo y al alma.',
        distance: 5300, duration: 75, difficulty: 'fácil', typeRoute: 'circular',
        location: 'Alfàs del Pi, Alicante', idCategory: 4,
        coordinates: [
            { lat: 38.5789, lng: 0.0234 }, { lat: 38.5823, lng: 0.0289 },
            { lat: 38.5857, lng: 0.0344 }, { lat: 38.5891, lng: 0.0289 },
            { lat: 38.5857, lng: 0.0234 }, { lat: 38.5789, lng: 0.0234 },
        ],
    },
    {
        title: 'Paseo Fluvial del Guadalquivir en Córdoba',
        description: 'El Paseo Fluvial del Guadalquivir en Córdoba es una de las caminatas urbanas y periurbanas más bellas de España. Bordea el río desde el Puente Romano hasta los jardines de la Victoria, pasando por la Torre de la Calahorra, las Caballerizas Reales y los sotos de ribera. El ambiente es tranquilo en las primeras horas de la mañana, cuando el río refleja la Mezquita-Catedral. Una caminata de recuperación perfecta, plana y bien iluminada, que además permite conocer el patrimonio de la ciudad califal.',
        distance: 8100, duration: 90, difficulty: 'fácil', typeRoute: 'circular',
        location: 'Córdoba', idCategory: 4,
        coordinates: [
            { lat: 37.8882, lng: -4.7794 }, { lat: 37.8923, lng: -4.7712 },
            { lat: 37.8964, lng: -4.7630 }, { lat: 37.9005, lng: -4.7712 },
            { lat: 37.8964, lng: -4.7794 }, { lat: 37.8882, lng: -4.7794 },
        ],
    },
    {
        title: 'Senda Botánica de Cercedilla',
        description: 'La Senda Botánica de Cercedilla (Madrid) es un recorrido interpretativo por los pinares de la Sierra de Guadarrama, diseñado para la observación de la flora serrana. El sendero está perfectamente señalizado y jalonado de paneles informativos sobre las especies vegetales, los insectos polinizadores y la geología granítica del macizo. La altitud (1200-1400 m) asegura temperaturas frescas incluso en verano. Una ruta ideal para la recuperación activa, el aprendizaje y la desconexión del estrés cotidiano.',
        distance: 5900, duration: 90, difficulty: 'fácil', typeRoute: 'circular',
        location: 'Cercedilla, Madrid', idCategory: 4,
        coordinates: [
            { lat: 40.7312, lng: -4.0521 }, { lat: 40.7367, lng: -4.0456 },
            { lat: 40.7422, lng: -4.0391 }, { lat: 40.7477, lng: -4.0456 },
            { lat: 40.7422, lng: -4.0521 }, { lat: 40.7312, lng: -4.0521 },
        ],
    },
    {
        title: 'Desfiladero del Río Aguas en Sorbas',
        description: 'El Paraje Natural del Karst en Yesos de Sorbas (Almería) alberga uno de los paisajes más surrealistas de Europa: cárcavas de yeso con colores blancos y ocres, cuevas subterráneas y el río Aguas tallando su camino entre las rocas. Esta ruta sigue el curso del río por el desfiladero, con algunos pasos cortos de trepa sobre roca (fáciles, sin exposición) y pozas de agua translúcida. El silencio, interrumpido solo por el canto de los mirlos acuáticos, hace de este lugar un refugio para la recuperación mental.',
        distance: 11600, duration: 180, difficulty: 'moderada', typeRoute: 'solo ida',
        location: 'Sorbas, Almería', idCategory: 4,
        coordinates: [
            { lat: 37.1234, lng: -2.1256 }, { lat: 37.1312, lng: -2.1145 },
            { lat: 37.1390, lng: -2.1034 }, { lat: 37.1468, lng: -2.0923 },
            { lat: 37.1546, lng: -2.0812 }, { lat: 37.1624, lng: -2.0701 },
        ],
    },
    {
        title: 'Ruta dels Estanys de la Pera',
        description: 'En el corazón del Parque Nacional de Aigüestortes i Estany de Sant Maurici (Lleida) se encuentra la maravilla de los estanys (lagos) de la Pera, un conjunto de lagos glaciares a más de 2200 m de altitud rodeados de picos de granito. La ruta parte desde Boí y asciende suavemente por el valle del Peguera, alternando bosques de pinos negros, turberas y marmitas de gigante hasta alcanzar los espejos de agua. El reflejo del cielo en los lagos es una experiencia estética que sana el espíritu.',
        distance: 10300, duration: 180, difficulty: 'moderada', typeRoute: 'circular',
        location: 'Boí, Lleida', idCategory: 4,
        coordinates: [
            { lat: 42.5734, lng: 0.9023 }, { lat: 42.5801, lng: 0.9102 },
            { lat: 42.5868, lng: 0.9181 }, { lat: 42.5935, lng: 0.9260 },
            { lat: 42.5868, lng: 0.9339 }, { lat: 42.5734, lng: 0.9023 },
        ],
    },

    // ── Categoría 5: Consolida ───────────────────────────────────────────────
    {
        title: 'GR-11 — Tramo Candanchú-Sallent de Gállego',
        description: 'El GR-11 o Sendero Pirenaico Transpirenaico traversa el Pirineo español de cabo a rabo. Este tramo entre Candanchú y Sallent de Gállego (Huesca) es uno de los más exigentes y espectaculares del recorrido, cruzando el collado de la Raca (2267 m) y descendiendo por el valle de Tena con panorámicas del Balaïtous y el Vignemale al fondo. Requiere condición física y experiencia en alta montaña. Los refugios de Bachimaña y Respomuso dan refugio en las etapas largas. Una ruta de referencia para consoldar el nivel montañero.',
        distance: 24200, duration: 480, difficulty: 'difícil', typeRoute: 'solo ida',
        location: 'Candanchú, Huesca', idCategory: 5,
        coordinates: [
            { lat: 42.7898, lng: -0.5213 }, { lat: 42.7956, lng: -0.5089 },
            { lat: 42.8014, lng: -0.4965 }, { lat: 42.8072, lng: -0.4841 },
            { lat: 42.8130, lng: -0.4717 }, { lat: 42.8188, lng: -0.4593 },
        ],
    },
    {
        title: 'Circular por los Siete Picos del Guadarrama',
        description: 'Los Siete Picos (2138 m) son una de las crestas más características de la Sierra de Guadarrama, visibles desde Madrid en los días despejados. Esta ruta circular los atraviesa de norte a sur, partiendo desde el Puerto de Navacerrada y recorriendo la cresta entre pinos silvestres y formaciones graníticas. El trazado tiene un desnivel moderado-alto, pero el terreno es siempre cómodo y está muy bien marcado. Una ruta que muchos madrileños repiten regularmente para mantener su forma física de forma progresiva.',
        distance: 19700, duration: 360, difficulty: 'moderada', typeRoute: 'circular',
        location: 'Navacerrada, Madrid', idCategory: 5,
        coordinates: [
            { lat: 40.7623, lng: -4.0234 }, { lat: 40.7712, lng: -4.0101 },
            { lat: 40.7801, lng: -3.9968 }, { lat: 40.7890, lng: -4.0101 },
            { lat: 40.7801, lng: -4.0234 }, { lat: 40.7623, lng: -4.0234 },
        ],
    },
    {
        title: 'Vuelta al Lago de Sanabria',
        description: 'El Lago de Sanabria (Zamora) es el mayor lago glaciar de la Península Ibérica y el epicentro del parque natural homónimo. Esta ruta circular de 11 km bordea completamente la lámina de agua por senderos de bosque y orillas pedregosas, con vistas continuas al agua azul turquesa y al pueblo medieval de San Martín de Castañeda. A lo largo del camino se cruzan tres ermitas, un monasterio y varios miradores que invitan a la pausa y la reflexión. Una vuelta que consolida el hábito del senderismo semanal.',
        distance: 11200, duration: 180, difficulty: 'fácil', typeRoute: 'circular',
        location: 'Galende, Zamora', idCategory: 5,
        coordinates: [
            { lat: 42.1232, lng: -6.7234 }, { lat: 42.1301, lng: -6.7156 },
            { lat: 42.1370, lng: -6.7078 }, { lat: 42.1439, lng: -6.7156 },
            { lat: 42.1370, lng: -6.7234 }, { lat: 42.1232, lng: -6.7234 },
        ],
    },
    {
        title: 'Ruta del Vino por la Ribera del Duero',
        description: 'Esta ruta de senderismo enoturístico recorre los viñedos más emblemáticos de la Denominación de Origen Ribera del Duero entre Peñafiel y Roa de Duero (Valladolid/Burgos). El camino discurre entre cepas viejas de Tempranillo, bodegas subterráneas talladas en la roca de toba y miradores sobre el río Duero. La experiencia se completa con una cata en alguna de las bodegas que flanquean el recorrido. Una salida que consolida el vínculo entre el paisaje, la cultura y el bienestar del caminante.',
        distance: 17900, duration: 270, difficulty: 'moderada', typeRoute: 'circular',
        location: 'Peñafiel, Valladolid', idCategory: 5,
        coordinates: [
            { lat: 41.5956, lng: -4.1123 }, { lat: 41.6034, lng: -4.0998 },
            { lat: 41.6112, lng: -4.0873 }, { lat: 41.6190, lng: -4.0998 },
            { lat: 41.6112, lng: -4.1123 }, { lat: 41.5956, lng: -4.1123 },
        ],
    },
    {
        title: 'Travesía de la Sierra de Béjar',
        description: 'La Sierra de Béjar, al sur de Salamanca, es el extremo occidental del Sistema Central y guarda paisajes de alta montaña sorprendentemente salvajes. Esta travesía de dos días (o una jornada larga) cruza el macizo de norte a sur, desde el Collado del Portillo hasta Candelario, pasando por el pico La Ceja (2425 m) y los bosques de roble albar de Vallejera. Los prados alpinos de verano, con sus manantiales y rebaños de vacas, son el mejor incentivo para completar el esfuerzo. Una ruta para caminantes con experiencia que quieren ir más lejos.',
        distance: 27800, duration: 480, difficulty: 'difícil', typeRoute: 'solo ida',
        location: 'Béjar, Salamanca', idCategory: 5,
        coordinates: [
            { lat: 40.3856, lng: -5.7634 }, { lat: 40.3934, lng: -5.7489 },
            { lat: 40.4012, lng: -5.7344 }, { lat: 40.4090, lng: -5.7199 },
            { lat: 40.4168, lng: -5.7054 }, { lat: 40.4246, lng: -5.6909 },
        ],
    },

    // ── Categoría 6: Socializa ───────────────────────────────────────────────
    {
        title: 'Ruta de los Castillos del Guadiana',
        description: 'Esta ruta en Badajoz conecta en un día los tres castillos que vigilan el tramo extremeño del Guadiana: Alconchel, Olivenza y Villanueva del Fresno. El camino transcurre por caminos rurales entre dehesas de encina y alcornoque, con vistas a Portugal al oeste. La arquitectura militar medieval, las leyendas locales y la hospitalidad extremeña hacen de esta excursión una experiencia social de primer orden. Perfecta para grupos de amigos que quieren combinar historia, naturaleza y gastronomía en un mismo día.',
        distance: 14100, duration: 210, difficulty: 'fácil', typeRoute: 'solo ida',
        location: 'Olivenza, Badajoz', idCategory: 6,
        coordinates: [
            { lat: 38.8794, lng: -6.9706 }, { lat: 38.8879, lng: -6.9567 },
            { lat: 38.8964, lng: -6.9428 }, { lat: 38.9049, lng: -6.9289 },
            { lat: 38.9134, lng: -6.9150 }, { lat: 38.9219, lng: -6.9011 },
        ],
    },
    {
        title: 'Camí de Ronda por la Costa Brava',
        description: 'El Camí de Ronda es el sendero litoral que recorre los 214 km de la Costa Brava, de Blanes a Portbou. Este tramo entre Cadaqués y Cap de Creus (Girona) es el más salvaje y espectacular: el paisaje volcánico del Cabo de Creus, los acantilados donde el tramuntana esculpe la piedra y las calas de agua color esmeralda. Es un recorrido que invita a compartir: a hacer paradas para bañarse, a comer en alguna cala recóndita y a descubrir cómo Dalí se enamoró de este rincón surreal del Mediterráneo.',
        distance: 18200, duration: 300, difficulty: 'moderada', typeRoute: 'circular',
        location: 'Cadaqués, Girona', idCategory: 6,
        coordinates: [
            { lat: 42.2890, lng: 3.2783 }, { lat: 42.2967, lng: 3.2856 },
            { lat: 42.3044, lng: 3.2929 }, { lat: 42.3121, lng: 3.3002 },
            { lat: 42.3044, lng: 3.3075 }, { lat: 42.2890, lng: 3.2783 },
        ],
    },
    {
        title: 'Ruta Megalítica de Antequera',
        description: 'Antequera (Málaga) alberga los dólmenes más grandes y mejor conservados de Europa, declarados Patrimonio de la Humanidad por la UNESCO en 2016. Esta ruta circular conecta los tres monumentos megalíticos (Menga, Viera y El Romeral) con una caminata por la vega antequerana con la Peña de los Enamorados al fondo. El recorrido es muy accesible y está pensado para compartir en familia o con amigos, con paneles interpretativos en cada dolmen. Una manera de adentrarse juntos en 4000 años de historia humana.',
        distance: 8300, duration: 120, difficulty: 'fácil', typeRoute: 'circular',
        location: 'Antequera, Málaga', idCategory: 6,
        coordinates: [
            { lat: 37.0177, lng: -4.5599 }, { lat: 37.0223, lng: -4.5523 },
            { lat: 37.0269, lng: -4.5447 }, { lat: 37.0315, lng: -4.5523 },
            { lat: 37.0269, lng: -4.5599 }, { lat: 37.0177, lng: -4.5599 },
        ],
    },
    {
        title: 'Lagos de Covadonga y Picos de Europa',
        description: 'Los Lagos de Covadonga (Enol y Ercina) son los más famosos de los Picos de Europa y uno de los destinos senderistas más concurridos de España, con razón sobrada. El acceso en temporada alta solo se permite a pie o en autobús lanzadera desde Arriondas. La circular completa incluye el Mirador del Rey (1680 m) y el Refugio de La Vega de Enol, con panorámicas sobrecogedoras del macizo Occidental. Es una ruta que se hace inevitablemente con otros caminantes, lo que genera conversaciones, encuentros y la sensación de pertenecer a una comunidad de amantes de la montaña.',
        distance: 9800, duration: 180, difficulty: 'moderada', typeRoute: 'circular',
        location: 'Cangas de Onís, Asturias', idCategory: 6,
        coordinates: [
            { lat: 43.2645, lng: -4.9812 }, { lat: 43.2723, lng: -4.9734 },
            { lat: 43.2801, lng: -4.9656 }, { lat: 43.2879, lng: -4.9734 },
            { lat: 43.2801, lng: -4.9812 }, { lat: 43.2645, lng: -4.9812 },
        ],
    },
    {
        title: 'Barranco del Poqueira y Pueblos de la Alpujarra',
        description: 'El Barranco del Poqueira, en La Alpujarra granadina, alberga tres de los pueblos blancos más bellos de Andalucía: Pampaneira, Bubión y Capileira, encajonados en la garganta del río Poqueira con el Mulhacén de fondo. La ruta baja desde Capileira por antiguos caminos de herradura, cruza el barranco varias veces por puentes de piedra y sube a Bubión y Pampaneira antes de volver al punto de partida. Las tinaos (pasadizos techados), las fuentes y los miradores sobre el barranco son excusas perfectas para compartir el camino con quien merece la pena.',
        distance: 15200, duration: 240, difficulty: 'moderada', typeRoute: 'solo ida',
        location: 'Capileira, Granada', idCategory: 6,
        coordinates: [
            { lat: 36.9623, lng: -3.4689 }, { lat: 36.9534, lng: -3.4578 },
            { lat: 36.9445, lng: -3.4467 }, { lat: 36.9356, lng: -3.4356 },
            { lat: 36.9267, lng: -3.4245 }, { lat: 36.9178, lng: -3.4134 },
        ],
    },
];

// Picsum seeds por tema (30 rutas × 3 imágenes = 90)
// Usamos seeds descriptivos para obtener imágenes consistentes y variadas
const IMAGE_SEEDS = [
    // Explora (rutas 0-4)
    ['mountain-gorge-spain', 'cliff-path-andalucia', 'river-canyon-malaga'],
    ['river-valley-asturias', 'forest-trail-sella', 'green-valley-north'],
    ['forest-sequoia-segovia', 'pine-woodland-castile', 'autumn-trees-spain'],
    ['greenway-andalucia', 'railway-trail-cadiz', 'olive-groves-andalucia'],
    ['gorge-picos-europa', 'canyon-cares-asturias', 'limestone-cliff-mountains'],
    // Desconecta (rutas 5-9)
    ['glacial-lake-soria', 'dark-lake-pines', 'mountain-lake-reflection'],
    ['river-trail-asturias', 'bear-path-trubia', 'forest-river-atlantic'],
    ['river-source-cazorla', 'turquoise-pools-spain', 'canyon-waterfalls-jaen'],
    ['beech-forest-navarra', 'irati-woods-autumn', 'green-forest-pyrenees'],
    ['basque-mountain-path', 'gorbeia-cross-peak', 'atlantic-highland-euskadi'],
    // Actívate (rutas 10-14)
    ['mulhacen-sierra-nevada', 'high-peak-alpine-south', 'snow-mountain-granada'],
    ['montserrat-jagged-peak', 'catalan-mountain-path', 'rocky-summit-barcelona'],
    ['veleta-peak-snow', 'sierra-nevada-summit', 'high-altitude-granite'],
    ['gredos-peak-castile', 'almanzor-rocky-top', 'circo-glaciar-avila'],
    ['pyrenean-traverse-snow', 'puigmal-high-ridge', 'mountain-crossing-pyrenees'],
    // Recupera (rutas 15-19)
    ['mediterranean-almond-trail', 'coastal-carob-alicante', 'gentle-hillside-spain'],
    ['guadalquivir-riverside', 'cordoba-river-walk', 'city-nature-andalucia'],
    ['pine-nature-madrid', 'cercedilla-botanical', 'guadarrama-forest-trail'],
    ['white-canyon-almeria', 'karst-yesos-sorbas', 'desert-gorge-southeast'],
    ['pyrenean-lakes-lleida', 'glacial-pond-aiguestortes', 'mountain-lake-national-park'],
    // Consolida (rutas 20-24)
    ['pyrenean-gr11-traverse', 'high-mountain-huesca', 'border-pass-pyrenees'],
    ['guadarrama-ridge-madrid', 'seven-peaks-castile', 'pine-mountain-circuit'],
    ['sanabria-lake-zamora', 'glacial-lake-circuit', 'green-lake-mountains'],
    ['vineyard-duero-valley', 'wine-landscape-castile', 'autumn-vines-valladolid'],
    ['bejar-sierra-ridge', 'high-central-system', 'oak-forest-salamanca'],
    // Socializa (rutas 25-29)
    ['extremadura-castle-trail', 'guadiana-river-badajoz', 'dehesa-oak-path'],
    ['costa-brava-cliffs', 'capo-creus-dramatic', 'mediterranean-coastal-trail'],
    ['antequera-dolmen-fields', 'megalithic-south-spain', 'ancient-stone-andalucia'],
    ['picos-covadonga-lakes', 'mountain-lake-asturias', 'iconic-north-spain'],
    ['alpujarra-white-village', 'poqueira-gorge-granada', 'sierra-nevada-south'],
];

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
    console.log('🌱  VitalTrail Seed — iniciando...\n');

    // 1. Crear usuarios -------------------------------------------------------
    console.log('👤  Creando 15 usuarios...');
    const createdUsers = [];
    for (const u of USERS) {
        const userId = crypto.randomUUID();
        await prisma.user.create({
            data: {
                idUser:    userId,
                email:     u.email,
                username:  u.username,
                password:  PASSWORD_HASH,
                name:      u.name,
                surname:   u.surname,
                birthday:  u.birthday ? new Date(u.birthday) : null,
                bio:       u.bio,
                imgUser:   u.imgUser,
                rol:       'ROLE_CLIENT',
                isActive:  true,
                isDeleted: false,
                isPremium: false,
                client:    { create: {} },
            },
        });
        createdUsers.push({ idUser: userId, ...u });
        process.stdout.write(`  ✓ ${u.username}\n`);
    }

    // 2. Crear rutas + imágenes ------------------------------------------------
    console.log('\n🗺   Creando 30 rutas con imágenes...');
    for (let i = 0; i < ROUTES.length; i++) {
        const r = ROUTES[i];
        const authorUser = createdUsers[i % createdUsers.length];
        const slug = generateSlug(r.title);

        const route = await prisma.route.create({
            data: {
                idUser:      authorUser.idUser,
                title:       r.title,
                description: r.description,
                distance:    r.distance,
                duration:    r.duration,
                difficulty:  r.difficulty,
                typeRoute:   r.typeRoute,
                location:    r.location,
                idCategory:  r.idCategory,
                coordinates: r.coordinates,
                slug,
            },
        });

        const seeds = IMAGE_SEEDS[i];
        const images = [];
        for (let n = 0; n < 3; n++) {
            const filename = `route-${route.idRoute}-${n + 1}.jpg`;
            const dest = path.join(IMAGE_DIR, filename);
            const url = `https://picsum.photos/seed/${seeds[n]}/1200/800`;

            if (!fs.existsSync(dest)) {
                process.stdout.write(`  ↓  ${filename} …`);
                const ok = await downloadWithRetry(url, dest);
                process.stdout.write(ok ? ' ✓\n' : ' ✗\n');
            } else {
                process.stdout.write(`  •  ${filename} (ya existe)\n`);
            }
            images.push(filename);
        }

        await prisma.imageRoute.createMany({
            data: images.map(imgRoute => ({ idRoute: route.idRoute, imgRoute })),
        });

        console.log(`  ✅ [${i + 1}/30] ${r.title} (id=${route.idRoute})`);
    }

    // 3. Resumen ---------------------------------------------------------------
    const totalUsers = await prisma.user.count();
    const totalRoutes = await prisma.route.count();
    const totalImages = await prisma.imageRoute.count();
    console.log(`\n✅  Seed completado:`);
    console.log(`   Usuarios totales en BD:  ${totalUsers}`);
    console.log(`   Rutas totales en BD:     ${totalRoutes}`);
    console.log(`   Imágenes totales en BD:  ${totalImages}`);
}

main()
    .catch((e) => { console.error('❌  Error:', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
