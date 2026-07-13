/**
 * Loads translations from the hosted Localang service and updates local files.
 *
 * @deprecated The hosted Localang service has been discontinued, so this helper no
 * longer has a working backend to talk to. It is kept for reference only. The i18n
 * library and ESLint plugin remain fully usable without it.
 *
 * @param authToken - Authorization token with translations:read permission.
 * @param projectId - ID of the project in the (discontinued) service.
 */
export declare const pull: (authToken: string, projectId: number) => void;
//# sourceMappingURL=pull.d.ts.map