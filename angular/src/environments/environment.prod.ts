import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44338/',
  redirectUri: baseUrl,
  clientId: 'CustomerPortal_App',
  scope: 'offline_access CustomerPortal',
  requireHttps: true,
  postLogoutRedirectUri: 'http://localhost:4200/account/login'
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'CustomerPortal',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:44338',
      rootNamespace: 'CustomerPortal',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
  remoteEnv: {
    url: '/getEnvConfig',
    mergeStrategy: 'deepmerge'
  }
} as Environment;
