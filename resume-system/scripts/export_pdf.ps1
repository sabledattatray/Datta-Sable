param([string]$OutputDirectory = (Join-Path $PSScriptRoot '../output'))
$ErrorActionPreference = 'Stop'
$taskOutput = (Resolve-Path -LiteralPath $OutputDirectory).Path
$taskWord = New-Object -ComObject Word.Application
$taskWord.Visible = $false
$taskWord.DisplayAlerts = 0
try {
  Get-ChildItem -LiteralPath $taskOutput -Filter '*.docx' -File | ForEach-Object {
    $taskDocument = $null
    try {
      $taskDocument = $taskWord.Documents.Open($_.FullName, $false, $true)
      $taskDocument.Repaginate()
      $taskPdf = [IO.Path]::ChangeExtension($_.FullName, '.pdf')
      $taskDocument.ExportAsFixedFormat($taskPdf, 17)
      Write-Output "Exported $([IO.Path]::GetFileName($taskPdf))"
    } finally {
      if ($null -ne $taskDocument) { $taskDocument.Close(0); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($taskDocument) }
    }
  }
} finally {
  $taskWord.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($taskWord)
}
