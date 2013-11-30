require 'capistrano/ext/multistage'
require 'bundler/capistrano'

set(:use_sudo, false)
set(:ssh_options, { :forward_agent => true })
set(:bundle_flags, "--deployment --quiet --binstubs")
set(:scm, :git)
set(:git_enable_submodules, 1)

set(:user, "bithub")
set(:application, "client")
set(:repository, "git@github.com:bitovi/bithub-client.git")

set(:deploy_via, :remote_cache)
set(:deploy_to) { "/home/#{user}/#{application}" }

set(:default_environment, {
  'PATH' => "/opt/rbenv/shims/:/opt/rbenv/bin:/home/#{user}/.rbenv/shims:/home/#{user}/.rbenv/bin:$PATH"
  
})

set(:stages, ['testing', 'staging', 'prod'])
set(:default_stage, 'testing')

namespace :deploy do
  desc "Symling uploads from api shared folder to bithub folder"
  task :symlink_uploads do
    run "ln -nfs /home/bithub/web/shared/uploads #{current_path}/uploads"
  end
end

after 'deploy:create_symlink', 'deploy:symlink_uploads'
