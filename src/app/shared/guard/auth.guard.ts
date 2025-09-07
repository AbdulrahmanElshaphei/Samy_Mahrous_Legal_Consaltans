import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const authGuard2: CanActivateFn = (route, state) => {
  let platForm = inject(PLATFORM_ID);

  if (isPlatformBrowser(platForm)) {
    return !localStorage.getItem("userToken");
  } else {
    return false;
  }
};