# Publishing Guide for @medusa-clone Packages

This guide walks you through the complete process of publishing packages to npm.

---

## 🚀 Publishing Checklist

### **Step 1: Pre-publish Validation** ✅

**1.1 - Check what will be published:**

```bash
cd packages/<package-name>
npm pack --dry-run
```

This shows exactly what files will be included in your package.

**1.2 - Review the list:**

- ✅ Should include: `dist/`, `package.json`, `README.md`, `LICENSE`
- ❌ Should NOT include: `src/`, `node_modules/`, `.turbo/`, test files

**1.3 - Add `.npmignore` if needed (optional):**
If you see unwanted files, create `.npmignore`:

```
src/
*.test.*
*.spec.*
tsconfig.json
tsup.config.ts
.turbo
```

---

### **Step 2: Build & Test** 🔨

**2.1 - Clean build:**

```bash
cd /Users/admin/Learning/front-end/medusa-clone
pnpm --filter <package-name> clean
pnpm --filter <package-name> build
```

**2.2 - Verify build output:**

```bash
ls packages/<package-name>/dist
```

Should see:

- `index.js` (CommonJS)
- `index.mjs` (ESM)
- `index.d.ts` (TypeScript types)
- `index.d.mts` (ESM types)
- `styles.css` (if applicable)

**2.3 - Test the build locally (optional):**

```bash
cd packages/<package-name>
npm pack
# This creates a .tgz file you can test install in another project
```

---

### **Step 3: Version Bump** 📝

**3.1 - Decide version number:**

- First release: `1.0.0` or `0.1.0`
- Patch (bug fix): `0.1.1`
- Minor (new feature): `0.2.0`
- Major (breaking change): `1.0.0`

**3.2 - Update version:**

```bash
cd packages/<package-name>
npm version 0.1.0
# Or use: npm version patch|minor|major
```

This will:

- Update `package.json` version
- Create a git commit
- Create a git tag

**OR manually edit** `package.json`:

```json
"version": "0.1.0"
```

---

### **Step 4: Verify Package Configuration** ⚠️

Ensure your `package.json` has the correct configuration:

```json
{
  "name": "@medusa-clone/package-name",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

**Key points:**

- ✅ `exports.types` points to `./dist/`, not `./src/`
- ✅ Include `main`, `module`, `types` for backward compatibility
- ✅ Export CSS if your package includes styles
- ✅ `publishConfig.access` is set to `"public"` for scoped packages

---

### **Step 5: NPM Login** 🔐

**5.1 - Check if logged in:**

```bash
npm whoami
```

**5.2 - If not logged in:**

```bash
npm login
```

Enter your npm credentials.

**5.3 - Verify access to publish scoped packages:**
Since packages are `@medusa-clone/*`, you need:

- An npm account
- Access to the `@medusa-clone` organization OR
- Use `"access": "public"` in `publishConfig` ✅

---

### **Step 6: Final Pre-flight Check** 🔍

**6.1 - Verify package.json:**

- ✅ Correct version number
- ✅ Correct exports paths (pointing to `dist/`, not `src/`)
- ✅ All dependencies are correct
- ✅ `peerDependencies` properly set
- ✅ `publishConfig.access = "public"`

**6.2 - Check for uncommitted changes:**

```bash
git status
```

Commit any changes:

```bash
git add .
git commit -m "chore: prepare package-name v0.1.0 for publish"
```

---

### **Step 7: Publish!** 🎉

**7.1 - Dry run first (recommended):**

```bash
cd packages/<package-name>
npm publish --dry-run
```

This shows what would be published without actually doing it.

**7.2 - Actual publish:**

```bash
npm publish --access public
```

**7.3 - Watch the output:**
You should see:

```
+ @medusa-clone/package-name@0.1.0
```

---

### **Step 8: Verify Publication** ✅

**8.1 - Check on npm:**

```bash
npm view @medusa-clone/package-name
```

**8.2 - Visit npm website:**

```
https://www.npmjs.com/package/@medusa-clone/package-name
```

**8.3 - Test installation in a new project:**

```bash
mkdir test-install
cd test-install
npm init -y
npm install @medusa-clone/package-name
```

---

### **Step 9: Git Tag & Push** 🏷️

**9.1 - Tag the release:**

```bash
git tag package-name-v0.1.0
```

**9.2 - Push to GitHub:**

```bash
git push origin main
git push origin package-name-v0.1.0
```

---

### **Step 10: Create GitHub Release** (Optional) 📄

1. Go to your repo: `https://github.com/baroxdev/medusa-clone`
2. Click "Releases" → "Create a new release"
3. Select tag `package-name-v0.1.0`
4. Add release notes:
   ```markdown
   ## Changes

   - 🎉 Initial release
   - ✨ Feature description
   - 🐛 Bug fixes
   - 📦 Dependency updates
   ```

---

## 📋 Quick Checklist

Before publishing, verify:

- [ ] Clean build completed successfully
- [ ] `dist/` folder contains all necessary files
- [ ] Version number updated in `package.json`
- [ ] `exports.types` points to `./dist/index.d.ts`, not `./src/`
- [ ] `peerDependencies` are correct
- [ ] Logged into npm (`npm whoami`)
- [ ] Ran `npm publish --dry-run` successfully
- [ ] All changes committed to git
- [ ] Ready to publish!

---

## 🔧 Troubleshooting

### "Cannot publish over the previously published versions"

- You're trying to publish a version that already exists
- Bump the version number: `npm version patch`

### "You must be logged in to publish packages"

- Run `npm login` and enter your credentials

### "You do not have permission to publish"

- Check you have access to the `@medusa-clone` org
- Ensure `publishConfig.access` is set to `"public"`

### "No such file or directory: dist/index.js"

- Build the package first: `pnpm build`
- Check your build script is working correctly

### CSS/Styles not included

- Ensure build script includes CSS compilation
- Add CSS to exports in `package.json`
- Verify `dist/styles.css` exists after build

---

## 📚 Additional Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [package.json exports field](https://nodejs.org/api/packages.html#exports)
