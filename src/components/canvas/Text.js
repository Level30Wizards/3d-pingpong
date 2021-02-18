import * as THREE from 'three'
import React, { forwardRef, useMemo } from 'react'
// import fontJson from '../../resources/firasans_regular.json'

const font = new THREE.FontLoader().parse({
  glyphs: {
    0: {
      ha: 775,
      x_min: 0,
      x_max: 0,
      o:
        'm 388 943 b 699 464 596 943 699 771 b 388 -17 699 156 596 -17 b 76 464 179 -17 76 156 b 388 943 76 772 179 943 m 388 842 b 210 464 271 842 210 736 b 388 85 210 190 271 85 b 565 464 503 85 565 190 b 388 842 565 736 503 842 ',
    },
    1: {
      ha: 601,
      x_min: 0,
      x_max: 0,
      o: 'm 449 0 l 321 0 l 321 793 l 104 661 l 49 751 l 336 929 l 449 929 ',
    },
    2: {
      ha: 688,
      x_min: 0,
      x_max: 0,
      o:
        'm 317 943 b 596 689 488 943 596 833 b 200 107 596 515 485 392 l 618 107 l 603 0 l 54 0 l 54 101 b 463 683 382 443 463 532 b 310 838 463 781 400 838 b 118 736 232 838 181 807 l 35 803 b 317 943 110 896 200 943 ',
    },
    3: {
      ha: 693,
      x_min: 0,
      x_max: 0,
      o:
        'm 313 943 b 588 707 490 943 588 832 b 407 493 588 589 511 518 b 617 268 524 482 617 408 b 300 -17 617 106 493 -17 b 21 108 189 -17 92 24 l 97 179 b 296 88 158 115 221 88 b 483 269 413 88 483 160 b 299 436 483 397 411 436 l 229 436 l 244 535 l 292 535 b 460 699 383 535 460 590 b 306 840 460 786 399 840 b 114 757 232 840 176 815 l 47 833 b 313 943 126 907 213 943 ',
    },
    4: {
      ha: 739,
      x_min: 0,
      x_max: 0,
      o:
        'm 697 229 l 576 229 l 576 0 l 453 0 l 453 229 l 56 229 l 56 321 l 335 943 l 442 899 l 190 331 l 454 331 l 465 581 l 576 581 l 576 331 l 697 331 ',
    },
    5: {
      ha: 696,
      x_min: 0,
      x_max: 0,
      o:
        'm 583 829 l 221 829 l 221 556 b 369 592 269 581 319 592 b 633 297 526 592 633 482 b 311 -17 633 113 504 -17 b 36 101 193 -17 108 28 l 111 175 b 310 88 169 117 229 88 b 500 300 426 88 500 164 b 331 493 500 443 426 493 b 199 461 281 493 243 482 l 99 461 l 99 929 l 601 929 ',
    },
    6: {
      ha: 740,
      x_min: 0,
      x_max: 0,
      o:
        'm 428 611 b 685 315 564 611 685 514 b 389 -17 685 113 553 -17 b 76 436 163 -17 76 169 b 428 943 76 740 208 943 b 619 886 503 943 565 922 l 569 801 b 426 842 526 828 478 842 b 204 489 292 842 211 701 b 428 611 265 575 340 611 m 389 85 b 556 311 499 85 556 175 b 406 510 556 458 493 510 b 206 382 322 510 253 458 b 389 85 211 179 265 85 ',
    },
    7: {
      ha: 617,
      x_min: 0,
      x_max: 0,
      o: 'm 575 833 l 228 -14 l 111 25 l 446 825 l 35 825 l 35 929 l 575 929 ',
    },
    8: {
      ha: 765,
      x_min: 0,
      x_max: 0,
      o:
        'm 507 499 b 703 249 635 447 703 365 b 381 -17 703 93 569 -17 b 63 246 189 -17 63 93 b 246 488 63 365 132 438 b 101 704 146 538 101 608 b 383 943 101 861 242 943 b 665 708 522 943 665 867 b 507 499 665 614 613 551 m 383 847 b 226 703 288 847 226 796 b 399 538 226 607 292 572 l 422 529 b 540 704 506 576 540 625 b 383 847 540 790 485 847 m 382 85 b 569 247 499 85 569 150 b 367 443 569 347 517 392 l 332 456 b 196 246 240 411 196 347 b 382 85 196 144 267 85 ',
    },
    9: {
      ha: 729,
      x_min: 0,
      x_max: 0,
      o:
        'm 360 943 b 660 582 560 943 660 800 b 165 -31 660 197 507 68 l 136 65 b 528 449 369 132 518 239 b 319 338 488 386 414 338 b 63 636 175 338 63 451 b 360 943 63 831 199 943 m 346 438 b 531 553 425 438 485 482 b 363 842 535 763 478 842 b 192 633 254 842 192 767 b 346 438 192 500 256 438 ',
    },
  },
  familyName: 'Fira Sans',
  ascender: 1299,
  descender: -368,
  underlinePosition: -104,
  underlineThickness: 69,
  boundingBox: { yMin: -490, xMin: -1050, yMax: 1533, xMax: 1889 },
  resolution: 1000,
  original_font_information: {
    format: 0,
    copyright:
      'Digitized data copyright 2012-2016, The Mozilla Foundation and Telefonica S.A.',
    fontFamily: 'Fira Sans',
    fontSubfamily: 'Regular',
    uniqueID: '4.203;CTDB;FiraSans-Regular',
    fullName: 'Fira Sans Regular',
    version: 'Version 4.203;PS 004.203;hotconv 1.0.88;makeotf.lib2.5.64775',
    postScriptName: 'FiraSans-Regular',
    trademark: 'Fira Sans is a trademark of The Mozilla Corporation.',
    manufacturer: 'Carrois Corporate GbR & Edenspiekermann AG',
    designer: 'Carrois Corporate & Edenspiekermann AG',
    manufacturerURL: 'http://www.carrois.com',
    designerURL: 'http://www.carrois.com',
    licence: 'Licensed under the Open Font License, version 1.1 or later',
    licenceURL: 'http://scripts.sil.org/OFL',
  },
  cssFontWeight: 'normal',
  cssFontStyle: 'normal',
})
const geom = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
  (number) => new THREE.TextGeometry(number, { font, size: 5, height: 0.1 })
)

const Text = forwardRef(
  (
    {
      children,
      vAlign = 'center',
      hAlign = 'center',
      size = 0.1,
      color = 'white',
      ...props
    },
    ref
  ) => {
    const array = useMemo(() => [...children], [children])
    return (
      <group ref={ref} {...props} dispose={null}>
        {array.map((char, index) => (
          <mesh
            position={[-(array.length / 2) * 3.5 + index * 3.5, 0, 0]}
            key={index}
            geometry={geom[parseInt(char)]}
          >
            <meshBasicMaterial
              attach='material'
              color={color}
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}
      </group>
    )
  }
)

export default Text
