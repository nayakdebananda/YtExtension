const vscode = require('vscode')
const fs = require('fs')
const ytdl = require('ytdl-core');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {


	console.log('Congratulations, your extension "youtube-downloader" is now active!')
	let disposable = vscode.commands.registerCommand('youtube-downloader.YouTubeVideoDownload', async function () {

		const url = await vscode.window.showInputBox()
			.then((data) => data.trim())
		if (url==null) return
		const infos = await (await ytdl.getBasicInfo(url))
		const title=infos.videoDetails.title
		const videoQualityInfos = infos.formats.filter((info) => {
			return info.mimeType.includes('video/mp4')
		}).map((data) => {
			return {
				label: `${title} - ${data.qualityLabel}`,
				detail: `${data.averageBitrate>4e+6?`${data.averageBitrate/(8e+6)} MB`:`${data.averageBitrate/(8000)} KB`}`,
				itag:data.itag.toString()
			}
		})

		videoQualityInfos.shift()
		const option = await vscode.window.showQuickPick(videoQualityInfos, {
			matchOnDetail: true, canPickMany: false
		})

		if (option==null) return
		const path=await vscode.window.showOpenDialog({
			canSelectFolders:true,
			canSelectMany:false,
			openLabel:'Save here',
			canSelectFiles:false,
		})
		const createPath=`${path[0].fsPath}/${option.label}.mp4`
		fs.writeFileSync(createPath,"dhhdhd")
		// const async  = await vscode.window.showInputBox().then(function(text){
		// 	return text
		// })
		// const url=await url
		// ytdl('https://www.youtube.com/watch?v=MRum4_A7nB0')
		// .pipe(fs.createWriteStream('D:\\download/video.mp4'))

		 vscode.window.showInformationMessage('Save here')
	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
