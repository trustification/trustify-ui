use base64::prelude::BASE64_STANDARD;
use base64::Engine;
use serde::Serialize;
use serde_json::Value;
use static_files::resource::new_resource;
use static_files::Resource;
use std::collections::HashMap;
use std::str::from_utf8;
use std::sync::OnceLock;

#[derive(Serialize, Clone, Default)]
pub struct UI {
    #[serde(rename(serialize = "VERSION"))]
    pub version: String,

    #[serde(rename(serialize = "AUTH_REQUIRED"))]
    pub auth_required: String,

    #[serde(rename(serialize = "OIDC_SERVER_URL"))]
    pub oidc_server_url: String,

    #[serde(rename(serialize = "OIDC_CLIENT_ID"))]
    pub oidc_client_id: String,

    #[serde(rename(serialize = "OIDC_SCOPE"))]
    pub oidc_scope: String,

    #[serde(rename(serialize = "ANALYTICS_ENABLED"))]
    pub analytics_enabled: String,

    #[serde(rename(serialize = "ANALYTICS_WRITE_KEY"))]
    pub analytics_write_key: String,
}

pub fn generate_index_html(
    ui: &UI,
    template_file: String,
    branding_file_content: String,
) -> tera::Result<String> {
    let template = template_file
        .replace("<%=", "{{")
        .replace("%>", "}}")
        .replace(
            "?? branding.application.title",
            "| default(value=branding.application.title)",
        )
        .replace(
            "?? branding.application.title",
            "| default(value=branding.application.title)",
        );

    let env_json = serde_json::to_string(&ui)?;
    let env_base64 = BASE64_STANDARD.encode(env_json.as_bytes());

    let branding: Value = serde_json::from_str(&branding_file_content)?;

    let mut context = tera::Context::new();
    context.insert("_env", &env_base64);
    context.insert("branding", &branding);

    tera::Tera::one_off(&template, &context, true)
}

pub fn trustify_ui(
    ui: &UI,
    mut resources: HashMap<&'static str, Resource>,
) -> HashMap<&'static str, Resource> {
    let template_file = resources.get("index.html.ejs");
    let branding_file_content = resources.get("branding/strings.json");

    let index_html = INDEX_HTML.get_or_init(|| {
        if let (Some(template_file), Some(branding_file_content)) =
            (template_file, branding_file_content)
        {
            let template_file =
                from_utf8(template_file.data).expect("cannot interpret template as UTF-8");
            let branding_file_content =
                from_utf8(branding_file_content.data).expect("cannot interpret branding as UTF-8");
            generate_index_html(
                ui,
                template_file.to_string(),
                branding_file_content.to_string(),
            )
            .expect("cannot generate index.html")
        } else {
            "Something went wrong".to_string()
        }
    });

    resources.insert("", new_resource(index_html.as_bytes(), 0, "text/html"));

    resources
}

static INDEX_HTML: OnceLock<String> = OnceLock::new();
