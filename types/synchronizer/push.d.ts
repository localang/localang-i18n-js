/**
 * Uploads local translations to the hosted Localang service.
 *
 * @deprecated The hosted Localang service has been discontinued, so this helper no
 * longer has a working backend to talk to. It is kept for reference only. The i18n
 * library and ESLint plugin remain fully usable without it.
 *
 * @param authToken - Authorization token with translations:update permission.
 * @param projectId - ID of the project in the (discontinued) service.
 * @param files - I18n files from which translations should be used.
 */
export declare const push: (authToken: string, projectId: number, files: string[]) => void;
//# sourceMappingURL=push.d.ts.map