#!/usr/bin/env python3
"""Create a portable independent animation example without installing dependencies."""
import argparse,shutil
from pathlib import Path

def main():
 parser=argparse.ArgumentParser(description=__doc__)
 parser.add_argument('--template',choices=['demo','coastal'],default='demo')
 parser.add_argument('--output',required=True,type=Path)
 args=parser.parse_args();skill=Path(__file__).resolve().parents[1];out=args.output.expanduser().resolve()
 if out.exists():parser.error('Target exists; choose a new directory. No files overwritten.')
 source=skill/'assets/templates'/args.template
 shutil.copytree(source,out)
 common=skill/'assets/common'
 if common.exists():shutil.copytree(common,out/'assets',dirs_exist_ok=True)
 for d in ['assets/vendor','assets/game','assets/audio','out/checks']:(out/d).mkdir(parents=True,exist_ok=True)
 print('Created:',out)
 print('Next: npm install, then follow the skill project-workflow reference.')
if __name__=='__main__':main()
