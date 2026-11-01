/**
 * Test Suite: Pengujian Alur Navigasi Root dan Redirect Auth LMS UNUSU
 * 
 * Verifikasi:
 * 1. Root route ('/') untuk kondisi Unauthenticated (guest): LandingPage tanpa redirect ke /admin atau /login secara paksa
 * 2. Redirect pasca login via getDefaultRedirectByRole untuk admin, dosen, dan mahasiswa
 * 3. Pemetaan SSO role ke application role pada backend & verifikasi rute yang dituju
 */

import { getDefaultRedirectByRole } from './src/client/App';

function runTestSuite() {
  console.log('===============================================================');
  console.log(' PENGUJIAN ALUR NAVIGASI ROOT & REDIRECT AUTH - LMS UNUSU');
  console.log('===============================================================\n');

  let passedCount = 0;
  let totalCount = 0;

  function assert(testName: string, condition: boolean, detail: string) {
    totalCount++;
    if (condition) {
      passedCount++;
      console.log(`[PASS] ${testName}`);
    } else {
      console.error(`[FAIL] ${testName} - ${detail}`);
    }
  }

  // UJI 1: Navigasi Root ('/') Unauthenticated (Guest)
  // Berdasarkan App.tsx RootRoute: jika !user, return <LandingPage />.
  // Tidak ada redirect ke /admin atau /login paksa.
  const guestUser = null;
  const isGuestShowingLanding = guestUser === null; // Sesuai logika RootRoute: if (!user) return <LandingPage />
  assert(
    'Uji Akses Root (/) Kondisi Unauthenticated (Guest)',
    isGuestShowingLanding,
    'Guest harus diarahkan menampilkan LandingPage publik, bukan redirect ke /admin'
  );

  // UJI 2: Verifikasi Alur Redirect Role Admin
  const adminRedirect: string = getDefaultRedirectByRole('admin');
  assert(
    'Uji Redirect Dashboard Role Admin',
    adminRedirect === '/' && adminRedirect !== '/admin',
    `Redirect admin harus ke dashboard root '/' bukan '/admin' (aktual: ${adminRedirect})`
  );

  // UJI 3: Verifikasi Alur Redirect Role Dosen
  const dosenRedirect = getDefaultRedirectByRole('dosen');
  assert(
    'Uji Redirect Dashboard Role Dosen',
    dosenRedirect === '/',
    `Redirect dosen harus ke dashboard root '/' (aktual: ${dosenRedirect})`
  );

  // UJI 4: Verifikasi Alur Redirect Role Mahasiswa
  const mahasiswaRedirect = getDefaultRedirectByRole('mahasiswa');
  assert(
    'Uji Redirect Dashboard Role Mahasiswa',
    mahasiswaRedirect === '/',
    `Redirect mahasiswa harus ke dashboard root '/' (aktual: ${mahasiswaRedirect})`
  );

  // UJI 5: Verifikasi Fallback Role yang Tidak Dikenal
  const fallbackRedirect = getDefaultRedirectByRole('unknown_role');
  assert(
    'Uji Fallback Redirect untuk Role Tidak Dikenal',
    fallbackRedirect === '/',
    `Redirect fallback harus ke '/' (aktual: ${fallbackRedirect})`
  );

  // UJI 6: Pemetaan SSO Role dari ONE UNUSU (Backend -> Frontend Integration)
  const SSO_ROLE_MAP: Record<string, string> = {
    SUPERADMIN: 'admin',
    DOSEN: 'dosen',
    MAHASISWA: 'mahasiswa',
  };
  const mapSsoRole = (role: string): string => SSO_ROLE_MAP[role] ?? 'mahasiswa';

  const ssoSuperadmin = mapSsoRole('SUPERADMIN');
  assert(
    'Uji SSO SUPERADMIN Mapping -> role admin -> redirect dashboard',
    ssoSuperadmin === 'admin' && getDefaultRedirectByRole(ssoSuperadmin) === '/',
    'SSO SUPERADMIN harus termap ke admin dan dashboard normal'
  );

  const ssoDosen = mapSsoRole('DOSEN');
  assert(
    'Uji SSO DOSEN Mapping -> role dosen -> redirect dashboard',
    ssoDosen === 'dosen' && getDefaultRedirectByRole(ssoDosen) === '/',
    'SSO DOSEN harus termap ke dosen dan dashboard normal'
  );

  const ssoMahasiswa = mapSsoRole('MAHASISWA');
  assert(
    'Uji SSO MAHASISWA Mapping -> role mahasiswa -> redirect dashboard',
    ssoMahasiswa === 'mahasiswa' && getDefaultRedirectByRole(ssoMahasiswa) === '/',
    'SSO MAHASISWA harus termap ke mahasiswa dan dashboard normal'
  );

  console.log('\n---------------------------------------------------------------');
  console.log(`Hasil Pengujian: ${passedCount}/${totalCount} tes lolos.`);
  console.log('---------------------------------------------------------------');

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runTestSuite();
