'use strict';
window.MISSIONS = [
  {
    id:1, start:2, color:'#62d7fb', label:'Visual ke simbol', title:'Telusuri jalur arus',
    short:'Baca rangkaian nyata', simTitle:'Satu saklar, dua jalur', simInstruction:'Buka dan tutup saklar. Amati lampu mana yang ikut berubah.',
    prompt:'Carilah kartu dengan rangkaian simbol yang sesuai dengan rangkaian nyata di atas!',
    context:'Rangkaian pada foto memiliki dua lampu. Resistor dan saklar berada pada jalur lampu bagian atas; lampu tengah memiliki jalurnya sendiri.',
    model:'Nilai contoh simulasi: baterai ideal 6 V, resistor 10 Ω, dan setiap lampu 10 Ω. Foto tidak mencantumkan nilainya. Saklar mula-mula terbuka, sesuai foto.',
    answer:1,
    options:[
      {id:'1.2', title:'Saklar di cabang atas, tanpa resistor', description:'Dua lampu pada cabang berbeda; cabang atas hanya memiliki saklar dan lampu.', reason:'Resistor pada jalur atas foto tidak muncul pada simbol ini. Saklar memang mengendalikan lampu atas, tetapi representasi harus mempertahankan seluruh komponen dan sambungannya.', formula:'Komponen yang hilang: resistor pada cabang atas.'},
      {id:'1.3', title:'Saklar dan resistor pada cabang atas', description:'Cabang atas berisi saklar, resistor, dan lampu; cabang tengah berisi satu lampu.', reason:'Susunannya sesuai foto: saklar dan resistor seri dengan lampu atas. Cabang lampu tengah tetap terhubung ke kedua terminal baterai. Saat saklar terbuka, lampu atas padam dan lampu tengah tetap menyala.', formula:'Cabang atas: S–R–lampu. Cabang tengah: lampu.'},
      {id:'1.4', title:'Saklar di cabang lampu tengah', description:'Resistor berada di atas, tetapi saklar memutus jalur lampu tengah.', reason:'Posisi saklar mengubah cabang yang diputus. Pada opsi ini, saklar terbuka memadamkan lampu tengah dan membiarkan lampu atas terhubung. Foto justru menunjukkan lampu tengah menyala dan lampu atas padam.', formula:'Posisi saklar menentukan jalur yang terputus.'},
      {id:'1.5', title:'Resistor pada jalur bersama', description:'Resistor berada sebelum percabangan sehingga dilalui arus kedua cabang.', reason:'Resistor pada foto hanya dilalui arus cabang atas. Pada opsi ini resistor berada di jalur bersama, sehingga juga memengaruhi tegangan pada lampu tengah. Hubungan rangkaiannya berbeda.', formula:'Foto: R hanya di cabang atas, bukan di jalur utama.'}
    ]
  },
  {
    id:2,start:7,color:'#ff7d8a',label:'Simbol ke verbal',title:'Apa yang terjadi pada lampu?',short:'Tambahkan cabang paralel',simTitle:'Satu lampu menjadi dua',simInstruction:'Tambahkan lampu kedua secara paralel. Bandingkan nyala dan arus lampu pertama.',
    prompt:'Tambahkan satu lampu secara paralel, apa yang akan terjadi pada lampu pertama pada rangkaian di atas?',
    context:'Perhatikan perbedaan antara arus total dari baterai dan arus pada setiap cabang.',
    model:'Baterai ideal 6 V dan lampu identik dengan hambatan tetap 12 Ω dipakai sebagai contoh. Jawaban “sama” mengasumsikan tegangan sumber tetap. Hambatan internal baterai nyata dapat menyebabkan hasil sedikit berbeda.',answer:1,
    options:[
      {id:'2.2',title:'Terang',description:'Penambahan cabang memperbesar arus total, sehingga arus lampu pertama juga dianggap bertambah.',reason:'Arus total bertambah karena ada jalur baru. Arus tambahan mengalir pada cabang baru; arus lampu pertama tetap V/R karena tegangan dan hambatannya tetap.',formula:'I₁ tetap; I<sub>total</sub> = I₁ + I₂ bertambah.'},
      {id:'2.3',title:'Sama',description:'Tegangan lampu pertama tetap sama dengan tegangan baterai sehingga dayanya tetap.',reason:'Kedua lampu paralel terhubung pada pasangan titik yang sama, sehingga masing-masing mendapatkan tegangan sumber. Dengan hambatan lampu tetap, arus dan daya lampu pertama tidak berubah.',formula:'V₁ = V<sub>s</sub> · I₁ = V<sub>s</sub>/R₁ · P₁ = V<sub>s</sub>²/R₁'},
      {id:'2.4',title:'Redup',description:'Tegangan baterai dianggap terbagi kepada kedua lampu.',reason:'Tegangan terbagi pada komponen yang disusun seri. Pada susunan paralel, tiap cabang mendapatkan tegangan yang sama, bukan separuh tegangan baterai.',formula:'Paralel: V₁ = V₂ = V<sub>s</sub>.'},
      {id:'2.5',title:'Padam',description:'Seluruh arus dianggap berpindah ke lampu baru sehingga lampu pertama tidak dialiri arus.',reason:'Arus mengalir pada kedua cabang yang tertutup, sesuai hambatan masing-masing. Cabang baru berisi lampu, bukan kawat hubung singkat, sehingga tidak membuat arus lampu pertama menjadi nol.',formula:'Kedua cabang tertutup: I₁ > 0 dan I₂ > 0.'}
    ]
  },
  {
    id:3,start:12,color:'#f8cf57',label:'Verbal ke matematis',title:'Temukan hubungan V, I, dan R',short:'Uji Hukum Ohm',simTitle:'Meja uji Hukum Ohm',simInstruction:'Ubah tegangan dan hambatan. Cocokkan arus pada rangkaian, persamaan, dan grafik.',
    prompt:'Pada rangkaian simbol terlihat sebuah baterai 12 V terhubung dengan resistor 4 Ω. Persamaan matematis yang tepat untuk menentukan arus adalah…',context:'Mulai dari hubungan V = I × R. Perhatikan kesesuaian simbol, angka yang disubstitusikan, dan satuannya.',model:'Nilai awal mengikuti kartu: V = 12 V dan R = 4 Ω. Sumber ideal; resistor ohmik dengan hambatan tetap pada setiap pengaturan.',answer:0,
    options:[
      {id:'3.2',title:'I = V/R = 12/4 = 3 A',description:'Rumus, substitusi, dan hasil sesuai Hukum Ohm.',reason:'Dari V = IR diperoleh I = V/R. Tegangan 12 V dibagi hambatan 4 Ω menghasilkan arus 3 A. Satuan volt per ohm adalah ampere.',formula:'I = 12 V / 4 Ω = 3 A'},
      {id:'3.3',title:'I = V/R = 4/12 = 0,33 A',description:'Rumus benar, tetapi angka tegangan dan hambatan tertukar.',reason:'Pada kartu misi, V bernilai 12 dan R bernilai 4. Menulis 4/12 setelah V/R menempatkan nilai hambatan pada pembilang dan tegangan pada penyebut.',formula:'Substitusi yang benar: V/R = 12/4, bukan 4/12.'},
      {id:'3.4',title:'I = R/V = 12/4 = 3 A',description:'Hasil angkanya 3 A, tetapi hubungan simbolnya keliru.',reason:'Arus adalah tegangan dibagi hambatan, bukan sebaliknya. Selain rumus I = R/V salah, substitusi R/V seharusnya 4/12. Hasil angka yang kebetulan sama tidak membuat rangkaian persamaan ini benar.',formula:'Hubungan yang benar: I = V/R.'},
      {id:'3.5',title:'I = R/V = 4/12 = 0,33 A',description:'Rumus memakai kebalikan hubungan yang diperlukan.',reason:'Nilai 4/12 sesuai urutan R/V, tetapi R/V bukan arus. Satuan Ω/V setara 1/A, bukan A. Arus yang benar tetap 12/4 = 3 A.',formula:'R/V = 1/I, sedangkan I = V/R.'}
    ]
  },
  {
    id:4,start:17,color:'#70e2a6',label:'Verbal ke simbol',title:'Rakit dari sebuah deskripsi',short:'Susun dua cabang lampu',simTitle:'Bangun rangkaianmu',simInstruction:'Pasang komponen sesuai urutan deskripsi, lalu tutup saklar untuk menguji kedua cabang.',
    prompt:'Sebuah baterai dihubungkan secara seri dengan satu saklar dan satu resistor. Setelah melewati resistor, rangkaian bercabang menjadi dua jalur paralel. Pada cabang pertama terdapat lampu L₁ dan L₂ yang disusun seri, sedangkan pada cabang kedua terdapat lampu L₃ dan L₄ yang juga disusun seri. Kedua cabang kemudian bergabung kembali dan terhubung ke baterai. Manakah rangkaian simbol yang sesuai dengan deskripsi tersebut?',
    context:'Kunci membaca deskripsi: resistor berada sebelum percabangan; masing-masing cabang memiliki dua lampu seri.',model:'Nilai contoh simulasi: baterai 12 V, resistor utama 2 Ω, dan tiap lampu 6 Ω. Nilai ini tidak tercetak pada kartu. Bagian yang belum dipasang merupakan jalur terbuka.',answer:2,
    options:[
      {id:'4.2',title:'Dua pasangan paralel disusun seri',description:'L₁ paralel L₂, lalu seri dengan pasangan L₃ paralel L₄.',reason:'Deskripsi meminta L₁ seri L₂ pada cabang atas dan L₃ seri L₄ pada cabang bawah. Opsi ini menghubungkan pasangan lampu secara paralel terlebih dahulu, lalu menserikan kedua pasangan tersebut.',formula:'Opsi: (L₁ ∥ L₂) seri (L₃ ∥ L₄).'},
      {id:'4.3',title:'Empat lampu dalam satu jalur',description:'Semua lampu, saklar, dan resistor tersusun seri.',reason:'Tidak ada titik percabangan. Arus yang sama melewati keempat lampu berurutan, sedangkan deskripsi menyebut dua cabang paralel yang masing-masing berisi dua lampu.',formula:'Deskripsi membutuhkan dua jalur, bukan satu.'},
      {id:'4.4',title:'Dua cabang, masing-masing dua lampu',description:'Saklar dan resistor utama diikuti cabang L₁–L₂ serta cabang L₃–L₄.',reason:'Opsi mempertahankan seluruh hubungan yang diminta: baterai–saklar–resistor pada jalur utama, kemudian dua cabang paralel dengan dua lampu seri per cabang, lalu bergabung kembali ke baterai.',formula:'R seri [(L₁ + L₂) ∥ (L₃ + L₄)].'},
      {id:'4.5',title:'Resistor hanya pada cabang atas',description:'Cabang L₁–L₂ memiliki resistor, sementara cabang L₃–L₄ tidak melewatinya.',reason:'Deskripsi menempatkan resistor sebelum titik percabangan agar dilalui arus total. Pada opsi ini resistor berada setelah percabangan, sehingga hanya dilalui arus lampu L₁ dan L₂.',formula:'Resistor utama harus dilalui I<sub>total</sub>.'}
    ]
  },
  {
    id:5,start:22,color:'#ffa45b',label:'Visual ke matematis',title:'Pecahkan rangkaian campuran',short:'Hitung arus setiap cabang',simTitle:'Dari jalur ke persamaan',simInstruction:'Ubah nilai resistor atau sumber. Amati arus yang terbagi dan tegangan pada cabang paralel.',
    prompt:'Dari rangkaian listrik di atas, tentukanlah representasi matematis yang sesuai!',context:'Pada foto: Vₛ = 12 V, R₁ = 2 Ω, R₂ = 4 Ω, R₃ = 8 Ω, dan R₄ = 6 Ω. R₂ dan R₃ seri pada cabang atas; R₄ berada pada cabang bawah.',model:'Saklar mula-mula ON. Sumber dan kabel ideal. Hambatan ekuivalen dihitung untuk jaringan resistor; saat saklar terbuka, arus sumber dan cabang bernilai nol.',answer:2,
    options:[
      {id:'5.2',title:'Cabang dikelompokkan keliru',description:'R₂ dianggap satu cabang, sedangkan R₃ dan R₄ dianggap seri di cabang lain.',reason:'Pada foto, satu jalur atas melewati R₂ lalu R₃ tanpa percabangan di antaranya. R₄ berada pada jalur bawah yang terpisah. Karena itu pasangan paralelnya adalah (R₂ + R₃) dengan R₄, bukan R₂ dengan (R₃ + R₄).',formula:'Benar: R<sub>p</sub> = 1 / [1/(R₂ + R₃) + 1/R₄].'},
      {id:'5.3',title:'Tegangan paralel dianggap tegangan R₁',description:'Hambatan total benar, tetapi Vₚ ditulis sama dengan I total × R₁.',reason:'I total × R₁ adalah penurunan tegangan pada resistor utama, bukan tegangan cabang paralel. Tegangan paralel adalah sisa tegangan sumber setelah dikurangi penurunan pada R₁. Pada nilai awal, V R₁ = 4 V dan Vₚ = 8 V.',formula:'V<sub>p</sub> = V<sub>s</sub> − I<sub>total</sub>R₁ = 12 − 2 × 2 = 8 V.'},
      {id:'5.4',title:'Seluruh hubungan sesuai rangkaian',description:'R₁ seri dengan paralel (R₂ + R₃) dan R₄; tiap arus dibagi hambatan cabangnya.',reason:'R₂ + R₃ = 12 Ω. Paralelnya dengan R₄ = 6 Ω menghasilkan Rₚ = 4 Ω. Maka R total = 6 Ω, I total = 2 A, dan Vₚ = 8 V. Arus atas = 8/12 = 2/3 A; arus R₄ = 8/6 = 4/3 A. Jumlahnya kembali 2 A.',formula:'R<sub>total</sub> = 6 Ω · I<sub>total</sub> = 2 A · V<sub>p</sub> = 8 V<br>I<sub>atas</sub> = ⅔ A · I₄ = 1⅓ A'},
      {id:'5.5',title:'Penyebut arus kedua cabang tertukar',description:'Arus atas dibagi R₄; arus I₄ dibagi R₂ + R₃.',reason:'Tegangan kedua cabang memang sama, tetapi arus harus dihitung dengan hambatan jalur yang dilewatinya. Cabang atas melewati R₂ dan R₃; cabang bawah hanya melewati R₄. Opsi ini menukar label arus cabang.',formula:'I<sub>atas</sub> = V<sub>p</sub>/(R₂ + R₃), sedangkan I₄ = V<sub>p</sub>/R₄.'}
    ]
  }
];
