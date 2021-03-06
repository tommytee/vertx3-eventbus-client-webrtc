/* globals module */
/* https://jsfiddle.net/katowulf/3gtDf/ */

module.exports = function () {

  return randomEl( adjectives ) + ' ' + randomEl( nouns )
}

function randomEl ( list ) {

  var i = Math.floor( Math.random() * list.length );

  return list[ i ]
}

var adjectives = [
  'adamant',
  'adroit',
  'amatory',
  'animistic',
  'antic',
  'arcadian',
  'baleful',
  'bellicose',
  'bilious',
  'boorish',
  'calamitous',
  'caustic',
  'cerulean',
  'comely',
  'concomitant',
  'contumacious',
  'corpulent',
  'crapulous',
  'creepy',
  'defamatory',
  'didactic',
  'dilatory',
  'dizzy',
  'dowdy',
  'efficacious',
  'effulgent',
  'egregious',
  'endemic',
  'equanimous',
  'execrable',
  'fastidious',
  'feckless',
  'fecund',
  'friable',
  'fulsome',
  'garrulous',
  'grave robbing',
  'gustatory',
  'heuristic',
  'histrionic',
  'hubristic',
  'impolite',
  'incendiary',
  'insidious',
  'insolent',
  'intransigent',
  'inveterate',
  'invidious',
  'irksome',
  'jejune',
  'jocular',
  'judicious',
  'lachrymose',
  'languid',
  'lurking',
  'loquacious',
  'luminous',
  'mannered',
  'measly',
  'mendacious',
  'meretricious',
  'minatory',
  'mordant',
  'munificent',
  'nefarious',
  'noxious',
  'obtuse',
  'parsimonious',
  'pendulous',
  'pernicious',
  'pervasive',
  'petulant',
  'platitudinous',
  'precipitate',
  'propitious',
  'querulous',
  'quiescent',
  'rebarbative',
  'recalcitant',
  'redolent',
  'rhadamanthine',
  'risible',
  'ruminative',
  'sagacious',
  'salubrious',
  'sartorial',
  'sclerotic',
  'serpentine',
  'snotty',
  'spasmodic',
  'strident',
  'taciturn',
  'tenacious',
  'thoughtful',
  'tremulous',
  'trenchant',
  'turbulent',
  'turgid',
  'ubiquitous',
  'uxorious',
  'verdant',
  'voluble',
  'voracious',
  'wheedling',
  'willing',
  'zealous' ];
var nouns = [
  'ninja',
  'chair',
  'pancake',
  'statue',
  'unicorn',
  'rainbows',
  'laser',
  'senor',
  'bunny',
  'captain',
  'nibblets',
  'cupcake',
  'carrot',
  'gnomes',
  'glitter',
  'potato',
  'salad',
  'toejam',
  'curtains',
  'beets',
  'toilet',
  'exorcism',
  'stick figures',
  'mermaid eggs',
  'sea barnacles',
  'dragons',
  'jellybeans',
  'snakes',
  'dolls',
  'bushes',
  'cookies',
  'apples',
  'ice cream',
  'ukulele',
  'kazoo',
  'banjo',
  'opera singer',
  'circus',
  'trampoline',
  'carousel',
  'carnival',
  'locomotive',
  'hot air balloon',
  'praying mantis',
  'animator',
  'artisan',
  'artist',
  'colorist',
  'inker',
  'coppersmith',
  'director',
  'designer',
  'flatter',
  'stylist',
  'leadman',
  'limner',
  'make-up artist',
  'model',
  'musician',
  'penciller',
  'scenographer',
  'set decorator',
  'silversmith',
  'teacher',
  'auto mechanic',
  'beader',
  'bobbin boy',
  'clerk of the chapel',
  'filling station attendant',
  'foreman',
  'maintenance engineering',
  'mechanic',
  'miller',
  'moldmaker',
  'panel beater',
  'patternmaker',
  'plant operator',
  'plumber',
  'sawfiler',
  'shop foreman',
  'soaper',
  'stationary engineer',
  'wheelwright',
  'woodworkers',
  'rabbit',
  'tiger',
  'flower',
  'oatmeal',
  'liquid'
];
