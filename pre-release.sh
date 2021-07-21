PACKAGE_JSON_VERSION=refs/heads/v$(cat package.json | jq '.version' | tr -d '"')
if [[ "${PACKAGE_JSON_VERSION}" != "${GITHUB_REF}" ]]
then
  echo -n "error: PACKAGE_JSON_VERSION ${PACKAGE_JSON_VERSION} mismatches "
  echo    "GITHUB_REF ${GITHUB_REF}"
  exit 1
fi
CLI_VERSION=refs/heads/v$(npx . --version)
if [[ "${CLI_VERSION}" != "${GITHUB_REF}" ]]
then
  echo -n "error: CLI_VERSION ${CLI_VERSION} mismatches "
  echo    "GITHUB_REF ${GITHUB_REF}"
  exit 1
fi