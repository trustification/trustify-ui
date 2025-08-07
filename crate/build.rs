use anyhow::{bail, Context};
use static_files::resource_dir;
use std::{
    env, fs, io,
    path::{Path, PathBuf},
    process::Command,
};
use walkdir::WalkDir;

const UI_DIR_SRC: &str = "res";

#[cfg(windows)]
static NPM_CMD: &str = "npm.cmd";
#[cfg(not(windows))]
static NPM_CMD: &str = "npm";

fn main() {
    println!("Build Trustify - build.rs!");

    println!("cargo:rerun-if-changed={UI_DIR_SRC}");

    for entry in WalkDir::new(UI_DIR_SRC).into_iter().filter_map(Result::ok) {
        println!("cargo:rerun-if-changed={}", entry.path().display());
    }

    let build = PathBuf::from(env::var_os("OUT_DIR").unwrap()).join("build");
    let dist = build.join("client").join("dist");

    println!("build: {}", build.display());
    println!("dist: {}", dist.display());

    build_ui(&build, &dist).expect("Error while building UI");
    resource_dir(dist)
        .build()
        .expect("failed to load resources");
}

fn install_ui_deps(build: &Path) -> anyhow::Result<()> {
    if build.join("node_modules").exists() {
        println!("Skipping dependency installation");
        return Ok(());
    }

    println!("Installing node dependencies...");
    let status = Command::new(NPM_CMD)
        .args(["clean-install", "--ignore-scripts"])
        .current_dir(build)
        .status()?;

    if !status.success() {
        bail!("Failed to install dependencies: {status}");
    }

    Ok(())
}

fn build_ui(build: &Path, dist: &Path) -> anyhow::Result<()> {
    match fs::remove_dir_all(build) {
        Err(err) if err.kind() == io::ErrorKind::NotFound => {}
        Err(err) => return Err(anyhow::Error::from(err).context("failed to remove build dir")),
        Ok(_) => {}
    }

    let n = copy_dir_all(UI_DIR_SRC, UI_DIR_SRC, build, &["crate", ".git"])
        .context("failed to copy src dir")?;

    println!("Copied {n} entries to {}", build.display());

    if dist.exists() {
        println!("Skipping build...");
        return Ok(());
    }

    install_ui_deps(build).context("failed to install dependencies")?;

    println!("Building UI {}...", build.display());
    let status = Command::new(NPM_CMD)
        .args(["run", "build"])
        .current_dir(build)
        .status()
        .context("failed to build UI")?;

    if !status.success() {
        bail!("Failed to perform UI build: {status}");
    }

    if !dist.exists() {
        eprintln!("UI build did not create dist dir: {}", dist.display());
    }

    Ok(())
}

fn copy_dir_all(
    root: impl AsRef<Path>,
    src: impl AsRef<Path>,
    dst: impl AsRef<Path>,
    ignore: &[&str],
) -> anyhow::Result<usize> {
    let root = root.as_ref();
    let src = src.as_ref();
    let dst = dst.as_ref();

    let mut n = 0;

    fs::create_dir_all(dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let path = entry.path();
        let ty = entry.file_type()?;

        let path = path.strip_prefix(root)?;

        if ignore.iter().map(Path::new).any(|entry| entry == path) {
            continue;
        }

        let file_name = entry.file_name();
        let dst_path = dst.join(&file_name);

        if ty.is_symlink() {
            let target = fs::read_link(entry.path())?;
            create_symlink(&target, &dst_path, &entry.path())?;
            n += 1;
        } else if ty.is_dir() {
            n += copy_dir_all(root, entry.path(), dst_path, ignore)?;
        } else {
            fs::copy(entry.path(), dst_path)?;
            n += 1;
        }
    }

    Ok(n)
}

fn create_symlink(
    original: &Path,
    link: &Path,
    #[allow(unused)] path: &Path,
) -> anyhow::Result<()> {
    #[cfg(unix)]
    {
        std::os::unix::fs::symlink(original, link).context("Failed to create symlink")
    }

    #[cfg(windows)]
    {
        if path_is_dir(original, path)? {
            std::os::windows::fs::symlink_dir(original, link)
                .context("Failed to create symlink (dir)")
        } else {
            std::os::windows::fs::symlink_file(original, link)
                .context("Failed to create symlink (file)")
        }
    }
}

#[allow(unused)]
fn path_is_dir(target: &Path, symlink_path: &Path) -> anyhow::Result<bool> {
    let resolved = if target.is_absolute() {
        target.to_path_buf()
    } else {
        match symlink_path.parent() {
            Some(parent) => parent.join(target),
            None => target.to_path_buf(),
        }
    };

    Ok(fs::metadata(&resolved).map(|m| m.is_dir())?)
}
