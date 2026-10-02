const customOrigin = process.env.GBET_PUBLIC_ORIGIN;
const repo = process.env.GBET_REPOSITORY;
if (!repo || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) throw new Error('Set GBET_REPOSITORY to owner/repository');
const [owner,name] = repo.split('/');
let basePath = name === `${owner}.github.io` ? '' : `/${name}`;
let origin = `https://${owner}.github.io${basePath}`;
if (customOrigin) {
  const url = new URL(customOrigin);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw new Error('GBET_PUBLIC_ORIGIN must be an HTTPS origin without a path');
  basePath = '';
  origin = url.origin;
}
export {basePath,origin};
