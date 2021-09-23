const vscode = require("vscode")
const fs = require("fs")
const ytdl = require("ytdl-core")

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  console.log(
    'Congratulations, your extension "youtube-downloader" is now active!'
  )
  let disposable = vscode.commands.registerCommand(
    "youtube-downloader.YouTubeVideoDownload",
    async function () {
      const date = new Date()
      const url = await vscode.window.showInputBox().then(data => data.trim())
      // if (url == null) return
      if (!ytdl.validateURL(url)) return

      const infos = await await ytdl.getInfo(url)
      // console.log(infos)
      const title = infos.videoDetails.title
      // console.log(infos.formats);
      const videoQualityInfos = infos.formats
        .filter(info => {
          return info.hasAudio == true && info.hasVideo == true
          // return info.mimeType.includes('video/mp4' ||)
        })
        .map(data => {
          return {
            label: `${title} - ${data.qualityLabel}`,
            detail: `${(parseInt(data.contentLength) / (1024 * 1024)).toFixed(
              2
            )} MB`,
            format: data.quality,
            itag: data.itag.toString(),
          }
        })

      // videoQualityInfos.shift()

      const option = await vscode.window.showQuickPick(videoQualityInfos, {
        matchOnDetail: true,
        canPickMany: false,
      })

      if (option == null) return
      const path = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: "Save here",
        canSelectFiles: false,
        defaultUri: vscode.Uri.parse(title),
      })
      // console.log(path);
      if (path == null) return
      const downloadPath = `${path[0].fsPath}/${date.getTime()}.mp4`
      const videoFormat = await ytdl.chooseFormat(infos.formats, {
        quality: option.itag,
      })
      // console.log(videoFormat);

      ytdl(url, { format: videoFormat }).pipe(
        fs.createWriteStream(downloadPath)
      )

      vscode.window.showInformationMessage("Downloading..")
      // vscode.window.withProgress({
      // 	location: vscode.ProgressLocation.Notification,
      // 	title:'Downloading',
      // 	cancellable:true
      // },(progress,token)=>{
      // 	token.onCancellationRequested(()=>{
      // 		console.log("Canceled");
      // 	})
      // 	return p
      // })
    }
  )

  context.subscriptions.push(disposable)
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
}
